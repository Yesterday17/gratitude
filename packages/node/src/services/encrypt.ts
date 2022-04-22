import * as crypto from "crypto";
import { md5 } from "./hash";

export function encrypt(key: string, data: Record<string, any>) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", md5(key), iv);

  const text = JSON.stringify(data);
  const encrypted = Buffer.concat([
    iv,
    cipher.getAuthTag(),
    cipher.update(text),
    cipher.final(),
  ]);
  return encrypted;
}

export function decryptText<T>(key: string, data: Buffer): T {
  const iv = data.slice(0, 16);
  const tag = data.slice(16, 32);
  const encrypted = data.slice(32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", md5(key), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return JSON.parse(decrypted.toString("utf-8"));
}
