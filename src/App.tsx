import { useState, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";

import SettingsView from "./components/SettingsView";
import { Gasto } from "./types";
import { Logo } from "./components/Logo";
import { useToast, ToastProvider } from "./components/ToastContext";
import ConfirmModal from "./components/ConfirmModal";
import { useFinanzas } from "./hooks/useFinance";
import Login from "./components/Login";
import { LogOut } from "lucide-react";

function AppContent({ alCerrarSesion }: { alCerrarSesion: () => void }) {
  const [vistaActual, setVistaActual] = useState("dashboard");
  const [esSidebarAbierto, setEsSidebarAbierto] = useState(false);
  const [esModalAbierto, setEsModalAbierto] = useState(false);
  const [gastoEditando, setGastoEditando] = useState<Gasto | undefined>(
    undefined,
  );

  const [esModalEliminarAbierto, setEsModalEliminarAbierto] = useState(false);
  const [gastoParaEliminar, setGastoParaEliminar] = useState<string | null>(null);
  const { showToast: mostrarToast } = useToast();

  const {
    gastos,
    estaCargando,
    nombresSocios,
    resumen,
    obtenerGastos,
    obtenerConfiguracion,
    eliminarGasto,
  } = useFinanzas(mostrarToast);

  const manejarExito = () => {
    obtenerGastos();
    mostrarToast(
      gastoEditando
        ? "Gasto actualizado correctamente"
        : "Gasto guardado correctamente",
      "success",
    );
  };

  const manejarEditarGasto = (gasto: Gasto) => {
    setGastoEditando(gasto);
    setEsModalAbierto(true);
  };

  const confirmarEliminarGasto = (id: string) => {
    setGastoParaEliminar(id);
    setEsModalEliminarAbierto(true);
  };

  const manejarEliminarGasto = async () => {
    if (!gastoParaEliminar) return;

    try {
      await eliminarGasto(gastoParaEliminar);
    } finally {
      setEsModalEliminarAbierto(false);
      setGastoParaEliminar(null);
    }
  };

  const obtenerTituloHeader = () => {
    switch (vistaActual) {
      case "dashboard":
        return "Panel de Control";
      case "history":
        return "Historial de Movimientos";

      case "settings":
        return "Configuración";
      default:
        return "Intux Finanzas";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar
        currentView={vistaActual}
        setView={setVistaActual}
        isOpen={esSidebarAbierto}
        setIsOpen={setEsSidebarAbierto}
      />

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/60 bg-white/80 px-6 backdrop-blur-xl transition-all">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setEsSidebarAbierto(true)}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3 md:hidden">
              <Logo className="h-6 w-6" showText={false} />
              <span className="font-bold text-zinc-900">Intux</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                {obtenerTituloHeader()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem("intux_pass");
                alCerrarSesion();
              }}
              className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
            <button
              onClick={() => {
                setGastoEditando(undefined);
                setEsModalAbierto(true);
              }}
              className="group flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 active:scale-95 transition-all shadow-lg shadow-zinc-900/10"
            >
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              <span className="hidden sm:inline">Nuevo Gasto</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {estaCargando ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
              <p className="text-zinc-400 font-medium animate-pulse">
                Cargando datos...
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {vistaActual === "dashboard" && (
                <Dashboard
                  summary={resumen}
                  recentExpenses={gastos}
                  partnerNames={nombresSocios}
                />
              )}
              {vistaActual === "history" && (
                <TransactionList
                  expenses={gastos}
                  partnerNames={nombresSocios}
                  onEdit={manejarEditarGasto}
                  onDelete={confirmarEliminarGasto}
                />
              )}

              {vistaActual === "settings" && (
                <SettingsView
                  partnerNames={nombresSocios}
                  onUpdateNames={() => {
                    obtenerConfiguracion();
                    mostrarToast("Nombres actualizados", "success");
                  }}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <TransactionForm
        isOpen={esModalAbierto}
        onClose={() => {
          setEsModalAbierto(false);
          setGastoEditando(undefined);
        }}
        onSuccess={manejarExito}
        partnerNames={nombresSocios}
        initialData={gastoEditando}
      />

      <ConfirmModal
        isOpen={esModalEliminarAbierto}
        onClose={() => setEsModalEliminarAbierto(false)}
        onConfirm={manejarEliminarGasto}
        title="Eliminar Gasto"
        message="¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isDestructive={true}
      />
    </div>
  );
}

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("intux_pass");
    if (token) {
      setEstaAutenticado(true);
    }
  }, []);

  // Auto-logout cuando cualquier llamada a la API recibe 401
  useEffect(() => {
    const handleUnauthorized = () => setEstaAutenticado(false);
    window.addEventListener("intux:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("intux:unauthorized", handleUnauthorized);
  }, []);

  if (!estaAutenticado) {
    return (
      <ToastProvider>
        <Login onLoginSuccess={() => setEstaAutenticado(true)} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AppContent alCerrarSesion={() => setEstaAutenticado(false)} />
    </ToastProvider>
  );
}

export default App;
