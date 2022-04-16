export type AppResponse<T> = {
  data?: T;
  errors?: unknown[];
};
