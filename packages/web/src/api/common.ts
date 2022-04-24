import { decryptResponse, decryptResponseString } from "../utils/encrypt";

export type ResponseType<T> = SuccessResponse<T> | FailedResponse;

export interface SuccessResponse<T> {
  code: 0;
  data: T;
}

export interface FailedResponse {
  code: number;
  message: string;
}

export function handleResponse<T extends Uint8Array | V, V = {}>(
  raw: boolean = false
) {
  return async (response: Response): Promise<T> => {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      // 错误提示
      const data: FailedResponse = await response.json();
      throw data.message;
    } else {
      // decrypt
      let data = new Uint8Array(await response.arrayBuffer());
      if (raw) {
        return decryptResponse(data) as Promise<T>;
      } else {
        const text = await decryptResponseString(data);
        const json = JSON.parse(text) as ResponseType<T>;
        if (json.code !== 0) {
          throw (json as FailedResponse).message;
        } else {
          // success
          return (json as SuccessResponse<T>).data;
        }
      }
    }
  };
}
