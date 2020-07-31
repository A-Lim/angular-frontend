export interface Product {
  id: number;
  name: string;
  description: string;
  status: string;
  price: number;
  seqNo: number;
  delivery_days: number;
  highlighted: boolean;
  custom: boolean;
}