import { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense, BalanceSummary, PayerType } from '../types';
import { api } from '../lib/api';

export function useFinance(showToast: (msg: string, type: 'success' | 'error') => void) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerNames, setPartnerNames] = useState({
    partnerA: 'Socio A',
    partnerB: 'Socio B'
  });

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      // PostgREST returns an array for SELECT queries
      if (data && data.length > 0) {
        setPartnerNames({
          partnerA: data[0].partner_a_name || 'Socio A',
          partnerB: data[0].partner_b_name || 'Socio B'
        });
      } else if (data && !Array.isArray(data)) {
        // Fallback if it's already an object
        setPartnerNames({
          partnerA: data.partner_a_name || data.partnerAName || 'Socio A',
          partnerB: data.partner_b_name || data.partnerBName || 'Socio B'
        });
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getExpenses();
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      showToast('Error al cargar gastos', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchExpenses();
    fetchSettings();
  }, [fetchExpenses, fetchSettings]);

  const calculateBalanceForCurrency = useCallback((currency: 'ARS' | 'USD', expensesList: Expense[]) => {
    const currencyExpenses = expensesList.filter(e => (e.currency || 'ARS') === currency);

    const totalA = currencyExpenses
      .filter(e => e.payer === 'Socio A')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalB = currencyExpenses
      .filter(e => e.payer === 'Socio B')
      .reduce((sum, e) => sum + e.amount, 0);

    const total = totalA + totalB;
    const sharePerPerson = total / 2;
    const balanceA = totalA - sharePerPerson;

    let debtor: PayerType | null = null;
    let creditor: PayerType | null = null;
    let amountOwed = 0;

    if (balanceA > 0.01) {
      creditor = 'Socio A';
      debtor = 'Socio B';
      amountOwed = balanceA;
    } else if (balanceA < -0.01) {
      creditor = 'Socio B';
      debtor = 'Socio A';
      amountOwed = Math.abs(balanceA);
    }

    return {
      total,
      totalA,
      totalB,
      debtor,
      creditor,
      amountOwed,
      currency
    };
  }, []);

  const summary: BalanceSummary = useMemo(() => {
    return {
      ARS: calculateBalanceForCurrency('ARS', expenses),
      USD: calculateBalanceForCurrency('USD', expenses)
    };
  }, [expenses, calculateBalanceForCurrency]);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      await api.deleteExpense(id);
      await fetchExpenses();
      showToast('Gasto eliminado correctamente', 'success');
    } catch (error) {
      console.error("Error deleting expense:", error);
      showToast('Error al eliminar gasto', 'error');
      throw error;
    }
  }, [fetchExpenses, showToast]);

  return {
    expenses,
    isLoading,
    partnerNames,
    summary,
    fetchExpenses,
    fetchSettings,
    deleteExpense
  };
}
