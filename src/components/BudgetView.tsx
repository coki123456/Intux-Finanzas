import React from 'react';
import { Expense } from '../types';
import { AlertCircle, TrendingDown, Target } from 'lucide-react';

interface BudgetViewProps {
    expenses: Expense[];
}

const BudgetView: React.FC<BudgetViewProps> = ({ expenses }) => {
    // Mock Budget Configuration
    const MONTHLY_BUDGET = 2500;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const spentThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBudget = MONTHLY_BUDGET - spentThisMonth;
    const percentageUsed = (spentThisMonth / MONTHLY_BUDGET) * 100;

    const isOverBudget = spentThisMonth > MONTHLY_BUDGET;

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Presupuesto Mensual</h1>
                    <p className="text-zinc-500 mt-1">Control de gastos para {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-zinc-200 text-zinc-900 rounded-xl font-medium text-sm hover:bg-zinc-50 transition-colors shadow-sm">
                    Editar Presupuesto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Budget Card */}
                <div className="md:col-span-3 rounded-2xl bg-zinc-900 text-white p-8 relative overflow-hidden shadow-2xl">
                    {/* Background effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-lg">
                                    <Target size={24} className="text-zinc-400" />
                                </div>
                                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Objetivo Mensual</span>
                            </div>
                            <span className="text-zinc-400 font-mono text-sm">${spentThisMonth.toFixed(2)} / ${MONTHLY_BUDGET.toFixed(2)}</span>
                        </div>

                        <div className="mb-6">
                            <div className="h-6 w-full bg-zinc-800 rounded-full overflow-hidden p-1">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-red-500' : 'bg-white'}`}
                                    style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div>
                                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Disponible</p>
                                <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-white'}`}>
                                    ${remainingBudget.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Porcentaje de Uso</p>
                                <p className="text-3xl font-bold text-white">{percentageUsed.toFixed(1)}%</p>
                            </div>
                            <div>
                                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Estado</p>
                                <div className="flex items-center gap-2">
                                    {isOverBudget ? (
                                        <>
                                            <AlertCircle className="text-red-400" size={20} />
                                            <span className="text-lg font-semibold text-red-400">Excedido</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="text-emerald-400" size={20} />
                                            <span className="text-lg font-semibold text-emerald-400">En Orden</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <h3 className="font-bold text-zinc-900">Gastos de este mes</h3>
                    <span className="text-xs font-medium px-3 py-1 bg-zinc-200 text-zinc-700 rounded-full">
                        {thisMonthExpenses.length} movimientos
                    </span>
                </div>
                <div className="divide-y divide-zinc-100">
                    {thisMonthExpenses.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">
                            No hay gastos registrados en este periodo.
                        </div>
                    ) : (
                        thisMonthExpenses.map(expense => (
                            <div key={expense.id} className="px-8 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-bold text-zinc-400 w-8 text-center">
                                        {new Date(expense.date).getDate()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900">{expense.concept}</p>
                                        <p className="text-xs text-zinc-500">{expense.payer}</p>
                                    </div>
                                </div>
                                <span className="font-mono font-medium text-zinc-900">
                                    -${expense.amount.toFixed(2)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetView;