import React from 'react';
import { Expense } from '../types';
import { Search, Filter, Download } from 'lucide-react';

interface TransactionListProps {
  expenses: Expense[];
}

const TransactionList: React.FC<TransactionListProps> = ({ expenses }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Historial de Transacciones</h1>
         <div className="flex gap-2 w-full sm:w-auto">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
                 <Download size={16} />
                 <span className="hidden sm:inline">Exportar</span>
             </button>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
         <div className="relative flex-1">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
             <input 
                type="text" 
                placeholder="Buscar movimientos..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
             />
         </div>
         <div className="flex gap-2">
             <select className="px-4 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:border-zinc-900 outline-none text-zinc-600">
                 <option>Todos los socios</option>
                 <option>Socio A</option>
                 <option>Socio B</option>
             </select>
             <select className="px-4 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:border-zinc-900 outline-none text-zinc-600">
                 <option>Este mes</option>
                 <option>Mes pasado</option>
                 <option>Este año</option>
             </select>
         </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-900">Fecha</th>
                <th className="px-6 py-4 font-semibold text-zinc-900">Concepto</th>
                <th className="px-6 py-4 font-semibold text-zinc-900">Pagado por</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 text-right">Monto</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {expense.concept}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${expense.payer === 'Socio A' 
                        ? 'bg-zinc-100 text-zinc-800 border-zinc-200' 
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'}
                    `}>
                      {expense.payer}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-zinc-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-zinc-400 hover:text-zinc-900 transition-colors">•••</button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                          No se encontraron transacciones.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;