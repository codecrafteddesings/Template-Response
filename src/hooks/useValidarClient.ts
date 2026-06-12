import { useState } from "react";
import { validarClient } from "../features/dashboard/services";
import type { ClientFormt } from "../features/dashboard/types";

interface UseValidarClientReturn {
  loading: boolean;
  resultado: string | null;
  errores: { rucCli?: string; telCli?: string };
  validar: (datos: ClientFormt) => Promise<void>;
  limpiarResultado: () => void;
}

export function useValidarClient(): UseValidarClientReturn {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [errores, setErrores] = useState<{ rucCli?: string; telCli?: string }>(
    {},
  );

  const validar = async (datos: ClientFormt) => {
    if (errores.rucCli || errores.telCli) return;

    setLoading(true);
    setResultado(null);

    try {
      const codigo = await validarClient(datos);

      if (codigo === "00") {
        setResultado("Éxito: Cliente actualizado");
        setErrores({});
      } else {
        setResultado(`Error: Código ${codigo}`);
      }
    } catch (err) {
      setResultado("Error de conexión con pub/400");
      alert("Error de conexión con pub/400");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultado = () => setResultado(null);

  return { loading, resultado, errores, validar, limpiarResultado };
}
