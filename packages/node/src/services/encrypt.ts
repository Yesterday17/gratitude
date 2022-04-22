import * as crypto from "crypto";
import { md5 } from "./hash";
import { Readable } from "stream";

export function encrypt(key: string, data: Record<string, any>) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", md5(key), iv);

  const text = JSON.stringify(data);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(text),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  return encrypted;
}

export function encryptStream(key: string, data: Readable): Readable {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", md5(key), iv);

  const controller = new Readable({});
  // 1. 写入 IV
  controller.push(iv);

  // 2. 写入加密内容
  data.on("data", (chunk) => {
    controller.push(cipher.update(chunk, "binary"));
  });

  data.on("end", () => {
    // 3. 写入最后一次加密
    controller.push(cipher.final("binary"));
    // 4. 写入 Auth Tag
    controller.push(cipher.getAuthTag());
    // 5. 结束
    controller.push(null);
  });

  return controller;
}

export function decrypt(key: string, data: Buffer) {
  const iv = data.slice(0, 16);
  const encrypted = data.slice(16, data.length - 16);
  const tag = data.slice(data.length - 16);
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

export function decryptStream(key: string, data: Readable): Readable {
  // TODO: 流式解密
  throw new Error("Not implemented");
}
