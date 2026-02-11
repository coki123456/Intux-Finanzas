
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

import SettingsView from './components/SettingsView';
import { Expense, BalanceSummary, PayerType } from './types';
import { Logo } from './components/Logo';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Custom Partner Names
  const [partnerNames, setPartnerNames] = useState({
    partnerA: 'Socio A',
    partnerB: 'Socio B'
  });

  const fetchSettings = async () => {
    try {
      if (!isSupabaseConfigured) return;

      const { data, error } = await supabase
        .from('app_settings')
        .select('partner_a_name, partner_b_name')
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows" error
        console.error("Error fetching settings:", error);
      }

      if (data) {
        setPartnerNames({
          partnerA: data.partner_a_name || 'Socio A',
          partnerB: data.partner_b_name || 'Socio B'
        });
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data & Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    fetchExpenses();
    fetchSettings();

    const channel = supabase
      .channel('db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => fetchExpenses())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, () => fetchSettings())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate Balance Summary for a specific currency
  const calculateBalanceForCurrency = (currency: 'ARS' | 'USD', expensesList: Expense[]) => {
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
  };

  const summary: BalanceSummary = useMemo(() => {
    return {
      ARS: calculateBalanceForCurrency('ARS', expenses),
      USD: calculateBalanceForCurrency('USD', expenses)
    };
  }, [expenses]);

  const handleSuccess = () => {
    // Local updates are handled via Realtime or manual re-fetch if needed
    // But standard way is waiting for realtime event. 
    // We can also optimistically update or just re-fetch here to be safe immediately.
    fetchExpenses();
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Panel de Control';
      case 'history': return 'Historial de Movimientos';

      case 'settings': return 'Configuración';
      default: return 'Intux Finanzas';
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/60 bg-white/80 px-6 backdrop-blur-xl transition-all">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3 md:hidden">
              <Logo className="h-6 w-6" showText={false} />
              <span className="font-bold text-zinc-900">Intux</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                {getHeaderTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-200 active:scale-95 transition-all shadow-lg shadow-zinc-900/10"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="hidden sm:inline">Nuevo Gasto</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {isLoading ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900"></div>
              <p className="text-zinc-400 font-medium animate-pulse">Cargando datos...</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {currentView === 'dashboard' && (
                <Dashboard
                  summary={summary}
                  recentExpenses={expenses}
                  partnerNames={partnerNames}
                />
              )}
              {currentView === 'history' && (
                <TransactionList expenses={expenses} />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  partnerNames={partnerNames}
                  onUpdateNames={fetchSettings} // Refresh after update
                />
              )}
            </div>
          )}
        </main>
      </div>

      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        partnerNames={partnerNames}
      />
    </div>
  );
}

export default App;