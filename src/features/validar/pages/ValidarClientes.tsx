import { useState, type ChangeEvent } from "react";
import { validarClient } from "../../dashboard/services";
import type { ClientFormt } from "../../dashboard/types";

const initialFormData: ClientFormt = {
  nomCli: "",
  patCli: "",
  matCli: "",
  corrCli: "",
  rucCli: "",
  telCli: "",
  codVal: "VAL",
};

export default function ValidarClientes() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{
    tipo: "exito" | "error";
    mensaje: string;
  } | null>(null);
  const [errores, setErrores] = useState<{ rucCli?: string; telCli?: string }>(
    {},
  );
  const [formData, setFormData] = useState<ClientFormt>(initialFormData);

  const validarDigitos = (value: string, campo: "rucCli" | "telCli") => {
    if (campo === "rucCli" && value.length != 11) {
      return "El valor ingrsado invalido, total digtos esperado 11!";
    } else if (campo === "telCli" && value.length != 10) {
      return "El valor ingrsado invalido, total digtos esperado 10! ";
    }
    return undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault();

    const errorRuc = validarDigitos(formData.rucCli, "rucCli");
    const errorTel = validarDigitos(formData.telCli, "telCli");
    const nuevosErrores: { rucCli?: string; telCli?: string } = {};
    if (errorRuc) nuevosErrores.rucCli = errorRuc;
    if (errorTel) nuevosErrores.telCli = errorTel;
    setErrores(nuevosErrores);

    if (nuevosErrores.rucCli || nuevosErrores.telCli) return;

    setLoading(true);
    setResultado(null);

    try {
      const codigo = await validarClient(formData);

      if (codigo === "00") {
        setResultado({ tipo: "exito", mensaje: "Cliente validado con exito!" });
        setFormData(initialFormData);
        setErrores({});
      } else {
        setResultado({ tipo: "error", mensaje: `Error: Código ${codigo}` });
      }
    } catch {
      setResultado({
        tipo: "error",
        mensaje: "Error de conexión con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setResultado(null);
    setErrores({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Validar Clientes</h1>
        <p className="text-gray-500">
          Complete los datos del cliente para validación
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit}>
          {/* Grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                name="nomCli"
                value={formData.nomCli}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ingrese nombre"
              />
            </div>

            {/* Primer Apellido */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Primer Apellido
              </label>
              <input
                name="patCli"
                value={formData.patCli}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ingrese apellido"
              />
            </div>

            {/* Segundo Apellido */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Segundo Apellido
              </label>
              <input
                name="matCli"
                value={formData.matCli}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Ingrese apellido"
              />
            </div>

            {/* Correo */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                name="corrCli"
                type="email"
                value={formData.corrCli}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="correo@ejemplo.com"
              />
            </div>

            {/* Cédula/RUC */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Cédula / RUC
              </label>
              <input
                name="rucCli"
                value={formData.rucCli}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errores.rucCli
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="12345678901"
              />
              {errores.rucCli && (
                <p className="text-red-500 text-xs mt-1">{errores.rucCli}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                name="telCli"
                value={formData.telCli}
                onChange={handleChange}
                required
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errores.telCli
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="0991234567"
              />
              {errores.telCli && (
                <p className="text-red-500 text-xs mt-1">{errores.telCli}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              data-white-btn
              disabled={loading}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-gray-900 dark:border dark:border-gray-300 dark:hover:bg-gray-100 px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
              {loading ? "Validando..." : "Validar Cliente"}
            </button>
            <button
              type="button"
              data-white-btn
              onClick={clearForm}
              className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-white dark:text-gray-900 dark:border dark:border-gray-300 dark:hover:bg-gray-100 px-6 py-2.5 rounded-lg font-medium transition"
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Toast resultado */}
        {resultado && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              resultado.tipo === "exito"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <span className="text-lg">
              {resultado.tipo === "exito" ? "✓" : "✗"}
            </span>
            <span className="flex-1 font-medium">{resultado.mensaje}</span>
            <button
              onClick={() => setResultado(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
