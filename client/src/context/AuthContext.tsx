import { createContext, useContext, useState, useEffect } from "react";
import authApi from "../APIServices/auth.api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("Access-Token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (name: string, password: string) => {
    try {
      const res = await authApi.login(name, password);

      const accessToken = res.data.token;

      localStorage.setItem("Access-Token", accessToken);
      setToken(accessToken);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("Access-Token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loading,
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
