import { encrypt } from "js-crypto-aes";
import { Global } from "../global";
import { md5 } from "./hash";
import { toBase64 } from "@aws-sdk/util-base64-browser";
import { getRandomUint8Array } from "./random";

const encoder = new TextEncoder();

export async function encryptPath(path: string) {
  const encrypted = await encrypt(
    // msg
    encoder.encode(path),
    // key
    encoder.encode(md5(Global.password)),
    {
      name: "AES-GCM",
      iv: getRandomUint8Array(12),
      tagLength: 16,
    }
  );
  return toBase64(encrypted);
}
