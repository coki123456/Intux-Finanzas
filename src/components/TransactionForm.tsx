import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  User,
  Users,
  Loader2,
  DollarSign,
  Coins,
} from "lucide-react";
import { TipoPagador, Moneda, Gasto } from "../types";
import { api } from "../lib/api";
import { useToast } from "./ToastContext";

interface FormularioTransaccionProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partnerNames: { partnerA: string; partnerB: string };
  initialData?: Gasto;
}

const TransactionForm: React.FC<FormularioTransaccionProps> = ({
  isOpen,
  onClose,
  onSuccess,
  partnerNames,
  initialData,
}) => {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState<Moneda>("ARS");
  const [pagador, setPagador] = useState<TipoPagador>("Socio A");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [estaCargando, setEstaCargando] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && initialData) {
      setConcepto(initialData.concepto);
      setMonto(initialData.monto.toString());
      setMoneda(initialData.moneda);
      setPagador(initialData.pagador);
      setFecha(initialData.fecha.split("T")[0]);
    } else if (isOpen && !initialData) {
      // Reiniciar formulario si se abre en modo "crear"
      setConcepto("");
      setMonto("");
      setMoneda("ARS");
      setPagador("Socio A");
      setFecha(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto || !monto || !pagador || !fecha) return;

    setEstaCargando(true);

    try {
      const datosGasto = {
        concepto,
        monto: parseFloat(monto),
        pagador,
        fecha,
        moneda,
      };

      if (initialData) {
        await api.actualizarGasto(initialData.id, datosGasto);
      } else {
        await api.crearGasto(datosGasto);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar gasto:", error);
      showToast("Error al guardar el gasto", "error");
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {initialData ? "Editar Gasto" : "Nuevo Gasto"}
            </h2>
            <p className="text-sm text-zinc-500">
              {initialData
                ? "Modifica los detalles del movimiento."
                : "Registra un movimiento compartido."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Concepto
            </label>
            <input
              type="text"
              required
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Compra de supermercado"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 font-semibold">
                  {moneda === "ARS" ? "$" : "u$d"}
                </span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-200 bg-white pl-12 pr-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                Moneda
              </label>
              <div className="flex rounded-lg border border-zinc-200 p-1 bg-zinc-50">
                <button
                  type="button"
                  onClick={() => setMoneda("ARS")}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                    moneda === "ARS"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <Coins size={14} /> ARS
                </button>
                <button
                  type="button"
                  onClick={() => setMoneda("USD")}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                    moneda === "USD"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  <DollarSign size={14} /> USD
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Fecha</label>
            <input
              type="date"
              required
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-600"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">
              ¿Quién pagó?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`
                relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all
                ${
                  pagador === "Socio A"
                    ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                    : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                }
              `}
              >
                <input
                  type="radio"
                  name="pagador"
                  value="Socio A"
                  checked={pagador === "Socio A"}
                  onChange={() => setPagador("Socio A")}
                  className="sr-only"
                />
                <User size={24} className="mb-2" />
                <span className="text-sm font-semibold text-center">
                  {partnerNames.partnerA}
                </span>
                {pagador === "Socio A" && (
                  <div className="absolute right-2 top-2 text-zinc-900">
                    <CheckCircle2 size={16} className="fill-current" />
                  </div>
                )}
              </label>

              <label
                className={`
                relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all
                ${
                  pagador === "Socio B"
                    ? "border-zinc-900 bg-zinc-50 text-zinc-900"
                    : "border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200"
                }
              `}
              >
                <input
                  type="radio"
                  name="pagador"
                  value="Socio B"
                  checked={pagador === "Socio B"}
                  onChange={() => setPagador("Socio B")}
                  className="sr-only"
                />
                <Users size={24} className="mb-2" />
                <span className="text-sm font-semibold text-center">
                  {partnerNames.partnerB}
                </span>
                {pagador === "Socio B" && (
                  <div className="absolute right-2 top-2 text-zinc-900">
                    <CheckCircle2 size={16} className="fill-current" />
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={estaCargando}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 active:scale-[0.99] transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {estaCargando ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {estaCargando
                ? "Guardando..."
                : initialData
                  ? "Actualizar Gasto"
                  : "Guardar Gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
