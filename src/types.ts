export type TipoPagador = "Socio A" | "Socio B";
export type Moneda = "ARS" | "USD";

// Campos en inglés para coincidir con lo que devuelve el backend
export interface Gasto {
  id: string;
  concept: string;
  amount: number;
  payer: TipoPagador;
  date: string;
  currency: Moneda;
}

export interface ResumenSaldoIndividual {
  total: number;
  totalA: number;
  totalB: number;
  deudor: TipoPagador | null;
  acreedor: TipoPagador | null;
  montoAdeudado: number;
  moneda: Moneda;
}

export interface ResumenBalance {
  ARS: ResumenSaldoIndividual;
  USD: ResumenSaldoIndividual;
}
