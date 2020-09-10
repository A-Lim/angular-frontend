export class ProductVm {
  name: string;
  description: string;
  status: string;
  price: number;
  seqNo: number;
  delivery_days: number;
  highlighted: boolean;
  custom: boolean;

  constructor() {
    this.name = '';
    this.description = '';
    this.status = 'active';
    this.highlighted = false;
    this.custom = false;
  }
}