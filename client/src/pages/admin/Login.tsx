import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeSlash, PiWarningCircle } from "react-icons/pi";
import { useAuth } from "../../context/AuthContext";
import { fieldClass, Button, Field } from "../../components/admin/ui";
import { getErrorMessage } from "../../utils/errors";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    if (!name.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      await login(name.trim(), password);
      navigate("/admin");
    } catch (err) {
      // AuthContext rethrows the server message as a plain Error.
      setError(err instanceof Error && err.message ? err.message : getErrorMessage(err, "Login failed. Try again."));
      setLoading(false);
    }
  };

  return (
    <div className="site min-h-[100dvh] bg-canvas text-fg font-sans antialiased flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-sm">
        <p className="text-sm text-muted">Admin</p>
        <h1 className="mt-2 font-display text-5xl font-medium leading-tight tracking-tight text-fg">Sign in</h1>
        <p className="mt-3 text-muted">Manage your portfolio content.</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 border border-red-400/60 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"
            >
              <PiWarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <Field label="Username" htmlFor="login-name">
            <input
              id="login-name"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
            />
          </Field>

          <Field label="Password" htmlFor="login-password">
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${fieldClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition-colors hover:text-fg"
              >
                {showPassword ? <PiEyeSlash className="h-5 w-5" /> : <PiEye className="h-5 w-5" />}
              </button>
            </div>
          </Field>

          <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
            {loading ? "Signing in" : "Sign in"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Login;
