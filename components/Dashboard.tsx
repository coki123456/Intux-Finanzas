import React from 'react';
import { ArrowRight, TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Expense, BalanceSummary } from '../types';

interface DashboardProps {
  summary: BalanceSummary;
  recentExpenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ summary, recentExpenses }) => {

  // Removed chartData as the chart is no longer displayed

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Debt Card - Highlighted */}
      <div className="overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-2xl shadow-zinc-900/20 relative border border-zinc-800">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                <Wallet size={20} className="text-zinc-400" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Balance Pendiente</h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 w-full flex justify-center lg:justify-start">
              {summary.amountOwed < 0.01 ? (
                 <div className="flex flex-col items-center lg:items-start gap-4 py-4">
                   <div className="flex items-center gap-4 text-emerald-400">
                     <div className="rounded-full bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
                       <CheckCircleIcon size={32} />
                     </div>
                     <span className="text-3xl font-bold tracking-tight">Cuentas Saldadas</span>
                   </div>
                   <p className="text-zinc-500 text-sm">No hay deudas pendientes entre los socios.</p>
                 </div>
              ) : (
                <div className="flex items-center gap-8 md:gap-12 relative">
                    {/* Debtor */}
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl font-bold border border-zinc-700 shadow-xl group-hover:border-zinc-500 transition-colors">
                                {summary.debtor === 'Socio A' ? 'A' : 'B'}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 uppercase tracking-wide">
                                Debe
                            </div>
                        </div>
                        <span className="text-sm font-medium text-zinc-400 mt-1">{summary.debtor}</span>
                    </div>

                    {/* Arrow and Amount */}
                    <div className="flex flex-col items-center gap-2 -mt-4">
                         <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Transfiere</span>
                         <div className="relative flex items-center">
                             <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
                             <ArrowRight size={16} className="absolute right-0 text-zinc-500" />
                         </div>
                         <div className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-xl shadow-lg mt-2 min-w-[120px] text-center border border-zinc-200">
                            ${summary.amountOwed.toFixed(2)}
                         </div>
                    </div>

                    {/* Creditor */}
                    <div className="flex flex-col items-center gap-3 group">
                         <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-white text-zinc-950 flex items-center justify-center text-2xl font-bold shadow-xl shadow-white/5 ring-4 ring-white/10">
                                {summary.creditor === 'Socio A' ? 'A' : 'B'}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                                Recibe
                            </div>
                        </div>
                        <span className="text-sm font-medium text-zinc-400 mt-1">{summary.creditor}</span>
                    </div>
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-auto flex flex-col gap-3">
               <button className="w-full lg:w-auto bg-white text-zinc-950 px-8 py-4 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                   Liquidar Deuda
                   <ArrowRight size={16} />
               </button>
               <p className="text-xs text-zinc-500 text-center lg:text-right px-2">
                   Se registrará un pago de ajuste.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-900">
                <TrendingUp size={20} />
            </div>
            <span className="text-sm font-medium">Gasto Total</span>
          </div>
          <p className="text-4xl font-bold text-zinc-900 tracking-tighter">${summary.total.toFixed(2)}</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1 bg-zinc-900/5"></div>
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-900">
                <ArrowUpRight size={20} />
            </div>
            <span className="text-sm font-medium">Socio A</span>
          </div>
          <p className="text-4xl font-bold text-zinc-900 tracking-tighter">${summary.totalA.toFixed(2)}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-900" style={{ width: `${summary.total > 0 ? (summary.totalA / summary.total * 100) : 0}%` }}></div>
            </div>
            <p className="text-xs font-medium text-zinc-500">{(summary.total > 0 ? (summary.totalA / summary.total * 100) : 0).toFixed(0)}%</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1 bg-zinc-900/5"></div>
           <div className="flex items-center gap-3 text-zinc-500 mb-4">
            <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-900">
                <ArrowDownLeft size={20} />
            </div>
            <span className="text-sm font-medium">Socio B</span>
          </div>
          <p className="text-4xl font-bold text-zinc-900 tracking-tighter">${summary.totalB.toFixed(2)}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-500" style={{ width: `${summary.total > 0 ? (summary.totalB / summary.total * 100) : 0}%` }}></div>
            </div>
            <p className="text-xs font-medium text-zinc-500">{(summary.total > 0 ? (summary.totalB / summary.total * 100) : 0).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
          {/* Recent List Section - Now full width */}
          <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-sm flex flex-col">
             <div className="border-b border-zinc-100 px-8 py-6 flex justify-between items-center bg-zinc-50/30">
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">Movimientos Recientes</h3>
                    <p className="text-sm text-zinc-500">Últimas 5 transacciones registradas</p>
                </div>
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                    Ver todo
                </button>
             </div>
             <div className="flex-1 divide-y divide-zinc-100">
                {recentExpenses.slice(0, 5).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between px-8 py-5 hover:bg-zinc-50 transition-colors group">
                        <div className="flex items-center gap-5">
                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105
                                ${expense.payer === 'Socio A' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}
                            `}>
                                {expense.payer === 'Socio A' ? 'A' : 'B'}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 mb-0.5">{expense.concept}</p>
                                <p className="text-xs font-medium text-zinc-400">{new Date(expense.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                            </div>
                        </div>
                        <span className="font-mono text-base font-bold text-zinc-900 bg-zinc-50 px-3 py-1 rounded-lg group-hover:bg-white border border-transparent group-hover:border-zinc-200 transition-all">
                            ${expense.amount.toFixed(2)}
                        </span>
                    </div>
                ))}
                {recentExpenses.length === 0 && (
                    <div className="px-6 py-12 text-center text-sm text-zinc-500 flex flex-col items-center gap-2">
                        <div className="p-3 bg-zinc-50 rounded-full mb-2">
                            <Wallet className="text-zinc-300" size={24} />
                        </div>
                        No hay movimientos registrados aún.
                    </div>
                )}
             </div>
          </div>
      </div>
    </div>
  );
};

// Helper icon
const CheckCircleIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default Dashboard;