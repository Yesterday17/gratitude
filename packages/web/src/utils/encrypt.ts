import { encrypt, decrypt } from "js-crypto-aes";
import { Global } from "../global";
import { md5 } from "./hash";
import { toBase64 } from "@aws-sdk/util-base64-browser";
import { getRandomUint8Array } from "./random";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function encryptPath(message: string) {
  const iv = getRandomUint8Array(12);
  const encrypted = await encrypt(
    // msg
    encoder.encode(message),
    // key
    encoder.encode(md5(Global.password)),
    {
      name: "AES-GCM",
      iv,
      tagLength: 16,
    }
  );
  return toBase64(new Uint8Array([...iv, ...encrypted]));
}

export async function decryptResponse(data: Uint8Array) {
  const iv = data.slice(0, 12);
  const remaining = data.slice(12);
  const decrypted = await decrypt(
    // data
    remaining,
    // key
    encoder.encode(md5(Global.password)),
    {
      name: "AES-GCM",
      iv,
    }
  );
  return decoder.decode(decrypted);
}
