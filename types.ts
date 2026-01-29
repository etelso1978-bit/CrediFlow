
export type CardBrand = 'Visa' | 'Mastercard' | 'Elo' | 'Amex' | 'Other';

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  limitTotal: number;
  closingDay: number;
  dueDay: number;
  brand: CardBrand;
  color: string;
}

export type Category = 
  | 'Alimentação' 
  | 'Transporte' 
  | 'Lazer' 
  | 'Saúde' 
  | 'Educação' 
  | 'Moradia' 
  | 'Assinaturas' 
  | 'Outros';

export interface Expense {
  id: string;
  cardId: string;
  amount: number;
  description: string;
  date: string; // ISO string
  category: Category;
  installments: number; // 1 for single purchase
  recurring: boolean;
}

export interface Invoice {
  month: number;
  year: number;
  expenses: Expense[];
  status: 'Aberto' | 'Fechado' | 'Pago';
  total: number;
}

export interface AppState {
  cards: CreditCard[];
  expenses: Expense[];
  theme: 'light' | 'dark';
}
