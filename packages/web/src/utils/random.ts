// 填充随机值进入 Uint8Array
export function getRandomUint8Array(length: number) {
  const arr = new Uint8Array(length);
  return crypto.getRandomValues(arr);
}
