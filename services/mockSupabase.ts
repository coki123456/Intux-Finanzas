import { Expense } from '../types';

// Initial dummy data
let MOCK_DATA: Expense[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    concept: 'Compra semanal en Whole Foods',
    amount: 145.20,
    payer: 'Socio A',
    date: '2023-10-24',
  },
  {
    id: '2',
    created_at: new Date().toISOString(),
    concept: 'Factura de Internet',
    amount: 59.99,
    payer: 'Socio B',
    date: '2023-10-22',
  },
  {
    id: '3',
    created_at: new Date().toISOString(),
    concept: 'Suscripción Netflix',
    amount: 15.00,
    payer: 'Socio A',
    date: '2023-10-20',
  },
  {
    id: '4',
    created_at: new Date().toISOString(),
    concept: 'Cena en Mario\'s',
    amount: 85.00,
    payer: 'Socio A',
    date: '2023-10-15',
  },
  {
    id: '5',
    created_at: new Date().toISOString(),
    concept: 'Alquiler Mensual',
    amount: 1200.00,
    payer: 'Socio B',
    date: '2023-10-12',
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    await delay(600); // Simulate network latency
    // Return a copy to avoid reference issues
    return [...MOCK_DATA].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async add(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    await delay(400);
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    MOCK_DATA = [newExpense, ...MOCK_DATA];
    return newExpense;
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    MOCK_DATA = MOCK_DATA.filter(item => item.id !== id);
  }
};