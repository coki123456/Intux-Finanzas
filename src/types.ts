export type PayerType = 'Socio A' | 'Socio B';

export interface Expense {
  id: string;
  created_at: string;
  concept: string;
  amount: number;
  payer: PayerType;
  date: string;
}

export interface BalanceSummary {
  total: number;
  totalA: number;
  totalB: number;
  debtor: PayerType | null; // Who owes money
  creditor: PayerType | null; // Who is owed money
  amountOwed: number;
}