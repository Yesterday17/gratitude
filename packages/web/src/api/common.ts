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
    // 返回格式为明文 JSON，包含错误信息
    if (contentType && contentType.includes("application/json")) {
      // 返回错误
      const data: FailedResponse = await response.json();
      throw data.message;
    } else {
      // 返回格式为加密后内容，对密文进行解密
      let data = new Uint8Array(await response.arrayBuffer());
      if (raw) {
        // 返回的内容不需要修改，直接解密返回即可
        return decryptResponse(data) as Promise<T>;
      } else {
        // 返回的内容是 JSON 格式，需要进行处理
        const text = await decryptResponseString(data);
        const json = JSON.parse(text) as ResponseType<T>;
        if (json.code !== 0) {
          // JSON 返回结果中包含错误信息
          throw (json as FailedResponse).message;
        } else {
          // 返回成功
          return (json as SuccessResponse<T>).data;
        }
      }
    }
  };
}
