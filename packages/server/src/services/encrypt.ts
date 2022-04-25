import * as crypto from "crypto";
import { md5 } from "./hash";
import { Readable } from "stream";

export function encrypt(key: string, data: Record<string, any>) {
  const iv = crypto.randomBytes(12);
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
  const iv = crypto.randomBytes(12);
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
  try {
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12, data.length - 16);
    const tag = data.slice(data.length - 16);
    const decipher = crypto.createDecipheriv("aes-256-gcm", md5(key), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
  } catch {
    throw {
      code: "-2",
      message: "解密失败！",
    };
  }
}

export function decryptText(key: string, data: Buffer) {
  return decrypt(key, data).toString("utf-8");
}

export function decryptJSON<T>(key: string, data: Buffer): T {
  return JSON.parse(decryptText(key, data));
}

// export function decryptStream(key: string, data: Readable): Readable {
//   // TODO: 流式解密
//   throw new Error("Not implemented");
// }

export function decryptRSA<T>(privateKey: string, encryptedData: Buffer): T {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  );
  const data = decryptedData.toString("utf-8");
  return JSON.parse(data);
}

// https://www.sohamkamani.com/nodejs/rsa-encryption/
export function generateKeyPair() {
  // The `generateKeyPairSync` method accepts two arguments:
  // 1. The type ok keys we want, which in this case is "rsa"
  // 2. An object with the properties of the key
  return crypto.generateKeyPairSync("rsa", {
    // The standard secure default length for RSA keys is 2048 bits
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
}
