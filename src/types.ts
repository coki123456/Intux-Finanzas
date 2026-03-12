export type TipoPagador = "Socio A" | "Socio B";
export type Moneda = "ARS" | "USD";

export interface Gasto {
  id: string;
  fecha_creacion: string;
  concepto: string;
  monto: number;
  pagador: TipoPagador;
  fecha: string;
  moneda: Moneda;
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
