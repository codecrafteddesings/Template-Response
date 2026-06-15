import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../services";
import { useAuthStore } from "../store";

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }

        const user = await registerRequest({ name, email, password });
        setUser(user);
        navigate("/");
      } else {
        const user = await loginRequest(email, password);
        setUser(user);
        navigate("/");
      }
    } catch {
      setError(
        mode === "login"
          ? "Credenciales inválidas"
          : "Error al registrar usuario",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(#E8E6E1_1px,transparent_1px)] dark:bg-[radial-gradient(#2A2A30_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-surface border border-border-light p-8 w-80 animate-scale-in"
      >
        <div className="mb-6 text-center">
          <h1 className="text-xl font-display font-bold text-text-primary tracking-tight">
            ValidaClientes
          </h1>
          <p className="text-[11px] text-text-secondary font-mono font-medium uppercase tracking-widest mt-1">
            IBM i System
          </p>
          <div className="mt-4 pt-4 border-t border-border-light">
            <h2 className="text-sm font-medium text-text-primary">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
          </div>
        </div>

        {error && (
          <p className="bg-redprimary-bg text-redprimary p-2.5 mb-4 text-xs font-medium rounded-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.25A.75.75 0 016 1.5zM6 8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              <path fillRule="evenodd" d="M6 0a6 6 0 100 12A6 6 0 006 0zM1.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {mode === "register" && (
          <div className="space-y-1.5 mb-4">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Nombre completo
            </label>
            <input
              type="text"
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-1.5 mb-4">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5 mb-5">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-border-light rounded-sm px-3 py-2.5 pr-10 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div className="space-y-1.5 mb-5">
            <label className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-border-light rounded-sm px-3 py-2.5 bg-surface text-text-primary placeholder:text-text-secondary/50 text-sm outline-none transition-all duration-150 focus:border-deepnavy focus:ring-1 focus:ring-deepnavy/20"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-deepnavy hover:bg-deepnavy-hover text-white font-medium text-sm px-4 py-2.5 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {loading
            ? mode === "login" ? "Entrando..." : "Creando cuenta..."
            : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>

        <p className="mt-4 text-center text-xs text-text-secondary">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-deepnavy dark:text-blue-300 hover:underline font-medium"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}
