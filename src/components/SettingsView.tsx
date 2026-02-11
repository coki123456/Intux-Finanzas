import React from 'react';
import { 
    Moon, 
    Bell, 
    Shield, 
    HelpCircle, 
    LogOut, 
    ChevronRight,
    User,
    Database,
    Download,
    Trash2
} from 'lucide-react';

const SettingsView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Configuración</h1>
            <p className="text-zinc-500 mt-1">Gestiona tus preferencias y datos de la aplicación.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-zinc-100">
                AD
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold text-zinc-900">Admin User</h2>
                <p className="text-zinc-500">admin@intux.com</p>
                <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-full border border-zinc-200">
                        Pro Plan
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                        Activo
                    </span>
                </div>
            </div>
            <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
                Editar Perfil
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="space-y-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-2">General</h3>
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
                                <Moon size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-zinc-900 text-sm">Apariencia</p>
                                <p className="text-xs text-zinc-500">Tema Claro (Default)</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
                                <Bell size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-zinc-900 text-sm">Notificaciones</p>
                                <p className="text-xs text-zinc-500">Activadas</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
                                <Shield size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-zinc-900 text-sm">Seguridad</p>
                                <p className="text-xs text-zinc-500">Contraseña y 2FA</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-zinc-400" />
                    </button>
                </div>
            </div>

            {/* Data Management */}
            <div className="space-y-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-2">Datos y Privacidad</h3>
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600 group-hover:bg-zinc-200 transition-colors">
                                <Download size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-zinc-900 text-sm">Exportar Datos</p>
                                <p className="text-xs text-zinc-500">Descargar CSV o PDF</p>
                            </div>
                        </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <Trash2 size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-red-600 text-sm">Borrar Datos</p>
                                <p className="text-xs text-red-400">Esta acción es irreversible</p>
                            </div>
                        </div>
                    </button>
                </div>
                
                <div className="flex items-center justify-center p-4">
                     <p className="text-xs text-zinc-400 text-center">
                         Intux Finanzas v1.0.0 <br/>
                         Build 2023.10.24
                     </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsView;