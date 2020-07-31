export interface OrderRequirement {
  id: number;
  order_id: number;
  name: string;
  email: string;
  description: string;
  fromLang: string;
  toLang: string;
  file: string;
  fileUrl: string;
  submitted: boolean;
}