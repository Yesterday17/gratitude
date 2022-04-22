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

export function decrypt(key: string, data: Buffer) {
  const iv = data.slice(0, 16);
  const tag = data.slice(16, 32);
  const encrypted = data.slice(32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", md5(key), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

export function decryptText(key: string, data: Buffer) {
  return decrypt(key, data).toString("utf-8");
}

export function decryptJSON(key: string, data: Buffer) {
  return JSON.parse(decryptText(key, data));
}
