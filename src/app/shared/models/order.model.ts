import { OrderRequirement } from './orderrequirement.model';
import { OrderTransacation } from './ordertransaction.model';

export interface Order {
  id: number;
  currency: string;
  status: string;
  refNo: string;
  total: string;
  items: OrderItem[];
  requirement: OrderRequirement;
  transactions: OrderTransacation[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  description: string;
  delivery_days: string;
  quantity: number;
  unit_price: number;
}