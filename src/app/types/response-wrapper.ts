export interface ResponseWrapper<T> {
  status: string;
  data: T;
  error?: string;
}
