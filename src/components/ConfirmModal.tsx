import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-3">
            {isDestructive && (
              <AlertTriangle className="text-red-500" size={20} />
            )}
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-zinc-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 bg-zinc-50 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`
                px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all
                ${
                  isDestructive
                    ? "bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-100"
                    : "bg-zinc-900 hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-100"
                }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
