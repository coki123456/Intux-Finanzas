import React, { useState, useMemo } from "react";
import { Expense } from "../types";
import {
  Search,
  Filter,
  Download,
  Pencil,
  Trash2,
  CalendarRange,
  X,
} from "lucide-react";

interface TransactionListProps {
  expenses: Expense[];
  partnerNames: { partnerA: string; partnerB: string };
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  expenses,
  partnerNames,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("Todos los socios");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const getPayerName = (payer: string) => {
    if (payer === "Socio A") return partnerNames.partnerA;
    if (payer === "Socio B") return partnerNames.partnerB;
    return payer;
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Search filter
      const matchesSearch = expense.concept
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Payer filter
      const matchesPayer =
        selectedPayer === "Todos los socios" ||
        (selectedPayer === "Socio A" && expense.payer === "Socio A") ||
        (selectedPayer === "Socio B" && expense.payer === "Socio B");

      // Date Range filter
      let matchesDate = true;
      if (dateRange.start) {
        matchesDate =
          matchesDate && new Date(expense.date) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDate =
          matchesDate && new Date(expense.date) <= new Date(dateRange.end);
      }

      return matchesSearch && matchesPayer && matchesDate;
    });
  }, [expenses, searchTerm, selectedPayer, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Historial de Transacciones
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-4">
        {/* Search and Payer Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Buscar movimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 text-sm focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none"
            />
          </div>
          <select
            value={selectedPayer}
            onChange={(e) => setSelectedPayer(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:border-zinc-900 outline-none text-zinc-600"
          >
            <option>Todos los socios</option>
            <option value="Socio A">{partnerNames.partnerA}</option>
            <option value="Socio B">{partnerNames.partnerB}</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-sm text-zinc-500 w-full sm:w-auto">
            <CalendarRange size={16} />
            <span className="font-medium">Filtrar por fecha:</span>
          </div>
          <div className="flex flex-1 w-full gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm focus:border-zinc-900 outline-none text-zinc-600"
              placeholder="Desde"
            />
            <span className="text-zinc-300 self-center">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm focus:border-zinc-900 outline-none text-zinc-600"
              placeholder="Hasta"
            />
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: "", end: "" })}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                title="Limpiar fechas"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-900">Fecha</th>
                <th className="px-6 py-4 font-semibold text-zinc-900">
                  Concepto
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900">
                  Pagado por
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 text-right">
                  Monto
                </th>
                <th className="px-6 py-4 font-semibold text-zinc-900 text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-zinc-50/80 transition-colors group"
                >
                  <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
                    {new Date(expense.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {expense.concept}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${
                        expense.payer === "Socio A"
                          ? "bg-zinc-100 text-zinc-800 border-zinc-200"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }
                    `}
                    >
                      {getPayerName(expense.payer)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-zinc-900">
                    <span className="text-zinc-400 text-xs mr-1">
                      {expense.currency}
                    </span>
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    {expenses.length === 0
                      ? "No hay transacciones registradas."
                      : "No se encontraron transacciones con los filtros actuales."}
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
