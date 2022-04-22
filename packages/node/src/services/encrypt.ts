import * as crypto from "crypto";

function encrypt(key: string, data: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let enc = cipher.update(data, "utf8", "binary");
  enc += cipher.final("binary");
  return [enc, iv, cipher.getAuthTag()];
}

// function decrypt(key: string, data: string) {
//   const decipher = crypto.createDecipheriv(ALGO, key, iv);
//   decipher.setAuthTag(authTag);
//   let str = decipher.update(enc, "base64", "utf8");
//   str += decipher.final("utf8");
//   return str;
// }
