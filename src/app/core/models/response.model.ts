export interface Response<T> {
  data: T;
  message?: string;
  redirect?: string;
  errors?: any;
}
