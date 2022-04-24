export type Response<T> = SuccessResponse<T> | FailedResponse;

export interface SuccessResponse<T> {
  code: number;
  data: T;
}

export interface FailedResponse {
  code: number;
  message: string;
}
