import { TransactionPackage } from './transaction-package.model';

export interface Transaction {
  id: number;
  amount: number;
  remarks: string;
  customer_id: number;
  customer_name: string;
  created_at: string;
  packages: TransactionPackage[];
}
