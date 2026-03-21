import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useToast } from "./ToastContext";
import { Loader2, Save } from "lucide-react";

interface SettingsViewProps {
  partnerNames: { partnerA: string; partnerB: string };
  onUpdateNames: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  partnerNames,
  onUpdateNames,
}) => {
  const [names, setNames] = useState(partnerNames);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // Sync state if props change (e.g. initial load)
  useEffect(() => {
    setNames(partnerNames);
  }, [partnerNames]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.actualizarConfiguracion({
        partner_a_name: names.partnerA,
        partner_b_name: names.partnerB,
      });

      onUpdateNames();
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Error al guardar la configuración", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Configuración
        </h1>
        <p className="text-zinc-500 mt-1">
          Gestiona los nombres de los socios y datos de la aplicación.
        </p>
      </div>

      {/* Name Configuration Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-6 space-y-6">
        <h2 className="text-lg font-semibold text-zinc-900">
          Nombres de Socios
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Nombre Socio A
            </label>
            <input
              type="text"
              value={names.partnerA}
              onChange={(e) => setNames({ ...names, partnerA: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all"
              placeholder="Ej: Esteban"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Nombre Socio B
            </label>
            <input
              type="text"
              value={names.partnerB}
              onChange={(e) => setNames({ ...names, partnerB: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all"
              placeholder="Ej: Maria"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-lg shadow-zinc-900/10"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
