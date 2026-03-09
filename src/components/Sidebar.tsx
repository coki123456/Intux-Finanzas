import React from "react";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setView,
  isOpen,
  setIsOpen,
}) => {
  const navItems = [
    { id: "dashboard", label: "Panel Principal", icon: LayoutDashboard },
    { id: "history", label: "Historial", icon: Receipt },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-zinc-950 text-white transition-transform duration-300 ease-out shadow-2xl
          md:translate-x-0 md:sticky md:top-0 md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center px-8 border-b border-white/5">
          <Logo
            className="h-8 w-8 text-white"
            textClassName="text-2xl text-white"
          />
        </div>

        <nav className="flex-1 space-y-2 px-4 py-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsOpen(false);
              }}
              className={`
                group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200
                ${
                  currentView === item.id
                    ? "bg-white text-zinc-950 shadow-lg shadow-white/5"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }
              `}
            >
              <item.icon
                size={20}
                className={`transition-colors duration-200 ${currentView === item.id ? "text-zinc-950" : "text-zinc-500 group-hover:text-white"}`}
                strokeWidth={currentView === item.id ? 2.5 : 2}
              />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
