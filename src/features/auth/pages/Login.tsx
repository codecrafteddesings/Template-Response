import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../services";
import { useAuthStore } from "../store";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </p>
        )}

        {mode === "register" && (
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full border p-2 mb-4 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Correo"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full border p-2 pr-10 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {mode === "register" && (
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              className="w-full border p-2 pr-10 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {mode === "login" && <div className="mb-6" />}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading
            ? mode === "login"
              ? "Entrando..."
              : "Creando cuenta..."
            : mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}
