import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../APIServices/auth.api";
import { AUTH_LOGOUT_EVENT, TOKEN_KEY } from "../utils/axios";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Read synchronously so protected routes see the token on the very first render.
const readStoredToken = () => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored && !isTokenExpired(stored)) return stored;
  localStorage.removeItem(TOKEN_KEY);
  return null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(readStoredToken);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  // The axios client fires this when the server rejects our token (401).
  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, logout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, logout);
  }, []);

  const login = async (name: string, password: string) => {
    try {
      const res = await authApi.login(name, password);

      const accessToken = res.data.token;

      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
