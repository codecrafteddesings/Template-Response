import Card from "@ui/Card";
import FormField from "@ui/FormField";
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
    if (campo === "rucCli" && value.length !== 11) {
      return "El valor ingresado es inválido, total dígitos esperado 11";
    }
    if (campo === "telCli" && value.length !== 10) {
      return "El valor ingresado es inválido, total dígitos esperado 10";
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
        setResultado({ tipo: "exito", mensaje: "Cliente validado con éxito" });
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">
          Validar Clientes
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Complete los datos del cliente para validación
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              label="Nombre"
              name="nomCli"
              value={formData.nomCli}
              onChange={handleChange}
              required
              placeholder="Ingrese nombre"
            />

            <FormField
              label="Primer Apellido"
              name="patCli"
              value={formData.patCli}
              onChange={handleChange}
              required
              placeholder="Ingrese apellido"
            />

            <FormField
              label="Segundo Apellido"
              name="matCli"
              value={formData.matCli}
              onChange={handleChange}
              required
              placeholder="Ingrese apellido"
            />

            <FormField
              label="Correo Electrónico"
              name="corrCli"
              type="email"
              value={formData.corrCli}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
            />

            <FormField
              label="Cédula / RUC"
              name="rucCli"
              value={formData.rucCli}
              onChange={handleChange}
              required
              mono
              placeholder="402-4567890-1"
              error={errores.rucCli}
            />

            <FormField
              label="Teléfono"
              name="telCli"
              value={formData.telCli}
              onChange={handleChange}
              required
              mono
              placeholder="829-772-9654"
              error={errores.telCli}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              data-white-btn
              disabled={loading}
              className="flex-1 sm:flex-none bg-deepnavy hover:bg-deepnavy-hover text-white px-6 py-2.5 rounded-sm font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              className="flex-1 sm:flex-none bg-surface-hover hover:bg-border-light text-text-primary px-6 py-2.5 rounded-sm font-medium text-sm transition-colors border border-border-light"
            >
              Limpiar
            </button>
          </div>
        </form>

        {resultado && (
          <div
            className={`mt-5 p-4 rounded-sm animate-fade-in flex items-center gap-3 ${
              resultado.tipo === "exito"
                ? "bg-terminalgreen-bg text-terminalgreen-dark border border-terminalgreen/20"
                : "bg-redprimary-bg text-redprimary border border-redprimary/20"
            }`}
          >
            <span className="text-lg font-mono">
              {resultado.tipo === "exito" ? ">" : "!"}
            </span>
            <span className="flex-1 text-sm font-medium">
              {resultado.mensaje}
            </span>
            <button
              onClick={() => setResultado(null)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.22 2.22a.75.75 0 011.06 0L6 4.94l2.72-2.72a.75.75 0 111.06 1.06L7.06 6l2.72 2.72a.75.75 0 11-1.06 1.06L6 7.06l-2.72 2.72a.75.75 0 01-1.06-1.06L4.94 6 2.22 3.28a.75.75 0 010-1.06z" />
              </svg>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
