export type PayerType = "Socio A" | "Socio B";
export type Currency = "ARS" | "USD";

export interface Expense {
  id: string;
  created_at: string;
  concept: string;
  amount: number;
  payer: PayerType;
  date: string;
  currency: Currency;
}

export interface SingleCurrencyBalance {
  total: number;
  totalA: number;
  totalB: number;
  debtor: PayerType | null;
  creditor: PayerType | null;
  amountOwed: number;
  currency: Currency;
}

export interface BalanceSummary {
  ARS: SingleCurrencyBalance;
  USD: SingleCurrencyBalance;
}
