export interface OrderTransacation {
  id: number;
  order_id: number;
  payment_transaction_id: string;
  action: string;
  status: string;
  payment_platform: string;
  details: string;
  created_at: string;
  updated_at: string;
}