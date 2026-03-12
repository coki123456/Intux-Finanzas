import { useState, useEffect, useMemo, useCallback } from "react";
import { Gasto, ResumenBalance, TipoPagador } from "../types";
import { api } from "../lib/api";

export function useFinanzas(
  mostrarToast: (mensaje: string, tipo: "success" | "error") => void,
) {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [nombresSocios, setNombresSocios] = useState({
    socioA: "Socio A",
    socioB: "Socio B",
  });

  const obtenerConfiguracion = useCallback(async () => {
    try {
      const datos = await api.obtenerConfiguracion();
      // PostgREST devuelve un array para consultas SELECT
      if (datos && datos.length > 0) {
        setNombresSocios({
          socioA: datos[0].partner_a_name || "Socio A",
          socioB: datos[0].partner_b_name || "Socio B",
        });
      } else if (datos && !Array.isArray(datos)) {
        // Fallback si ya es un objeto
        setNombresSocios({
          socioA: datos.partner_a_name || datos.partnerAName || "Socio A",
          socioB: datos.partner_b_name || datos.partnerBName || "Socio B",
        });
      }
    } catch (error) {
      console.error("Error al obtener configuración:", error);
    }
  }, []);

  const obtenerGastos = useCallback(async () => {
    try {
      setEstaCargando(true);
      const datos = await api.obtenerGastos();
      setGastos(datos || []);
    } catch (error) {
      console.error("Error al obtener gastos:", error);
      mostrarToast("Error al cargar gastos", "error");
    } finally {
      setEstaCargando(false);
    }
  }, [mostrarToast]);

  useEffect(() => {
    obtenerGastos();
    obtenerConfiguracion();
  }, [obtenerGastos, obtenerConfiguracion]);

  const calcularBalancePorMoneda = useCallback(
    (moneda: "ARS" | "USD", listaGastos: Gasto[]) => {
      const gastosMoneda = listaGastos.filter(
        (g) => (g.moneda || "ARS") === moneda,
      );

      const totalA = gastosMoneda
        .filter((g) => g.pagador === "Socio A")
        .reduce((suma, g) => suma + g.monto, 0);

      const totalB = gastosMoneda
        .filter((g) => g.pagador === "Socio B")
        .reduce((suma, g) => suma + g.monto, 0);

      const total = totalA + totalB;
      const cuotaPorPersona = total / 2;
      const balanceA = totalA - cuotaPorPersona;

      let deudor: TipoPagador | null = null;
      let acreedor: TipoPagador | null = null;
      let montoAdeudado = 0;

      if (balanceA > 0.01) {
        acreedor = "Socio A";
        deudor = "Socio B";
        montoAdeudado = balanceA;
      } else if (balanceA < -0.01) {
        acreedor = "Socio B";
        deudor = "Socio A";
        montoAdeudado = Math.abs(balanceA);
      }

      return {
        total,
        totalA,
        totalB,
        deudor,
        acreedor,
        montoAdeudado,
        moneda,
      };
    },
    [],
  );

  const resumen: ResumenBalance = useMemo(() => {
    return {
      ARS: calcularBalancePorMoneda("ARS", gastos),
      USD: calcularBalancePorMoneda("USD", gastos),
    };
  }, [gastos, calcularBalancePorMoneda]);

  const eliminarGasto = useCallback(
    async (id: string) => {
      try {
        await api.eliminarGasto(id);
        await obtenerGastos();
        mostrarToast("Gasto eliminado correctamente", "success");
      } catch (error) {
        console.error("Error al eliminar gasto:", error);
        mostrarToast("Error al eliminar gasto", "error");
        throw error;
      }
    },
    [obtenerGastos, mostrarToast],
  );

  return {
    gastos,
    estaCargando,
    nombresSocios,
    resumen,
    obtenerGastos,
    obtenerConfiguracion,
    eliminarGasto,
  };
}
