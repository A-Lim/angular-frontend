import { OrderRequirement } from './orderrequirement.model';
import { OrderTransacation } from './ordertransaction.model';
import { OrderWorkItem } from './orderworkitem.model';

export interface Order {
  id: number;
  email: string;
  currency: string;
  status: string;
  refNo: string;
  total: string;
  password: string;
  items: OrderItem[];
  requirement: OrderRequirement;
  transactions: OrderTransacation[];
  workitems: OrderWorkItem[];
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