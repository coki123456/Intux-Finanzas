
import React, { useState } from 'react';
import { X, CheckCircle2, User, Users, Loader2 } from 'lucide-react';
import { PayerType } from '../types';
import { supabase } from '../lib/supabase';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState<PayerType>('Socio A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount || !payer || !date) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          concept,
          amount: parseFloat(amount),
          payer,
          date,
        });

      if (error) throw error;

      // Reset form
      setConcept('');
      setAmount('');
      setPayer('Socio A');
      setDate(new Date().toISOString().split('T')[0]);
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error al guardar el gasto');
    } finally {
      setIsLoading(false);
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
            <h2 className="text-lg font-semibold text-zinc-900">Nuevo Gasto</h2>
            <p className="text-sm text-zinc-500">Registra un movimiento compartido.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Concepto</label>
            <input
              type="text"
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ej: Compra de supermercado"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Monto</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500 font-semibold">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">¿Quién pagó?</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`
                relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all
                ${payer === 'Socio A'
                  ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                  : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'}
              `}>
                <input
                  type="radio"
                  name="payer"
                  value="Socio A"
                  checked={payer === 'Socio A'}
                  onChange={() => setPayer('Socio A')}
                  className="sr-only"
                />
                <User size={24} className="mb-2" />
                <span className="text-sm font-semibold">Socio A</span>
                {payer === 'Socio A' && (
                  <div className="absolute right-2 top-2 text-zinc-900">
                    <CheckCircle2 size={16} className="fill-current" />
                  </div>
                )}
              </label>

              <label className={`
                relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all
                ${payer === 'Socio B'
                  ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                  : 'border-zinc-100 bg-white text-zinc-500 hover:border-zinc-200'}
              `}>
                <input
                  type="radio"
                  name="payer"
                  value="Socio B"
                  checked={payer === 'Socio B'}
                  onChange={() => setPayer('Socio B')}
                  className="sr-only"
                />
                <Users size={24} className="mb-2" />
                <span className="text-sm font-semibold">Socio B</span>
                {payer === 'Socio B' && (
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
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 active:scale-[0.99] transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isLoading ? 'Guardando...' : 'Guardar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;