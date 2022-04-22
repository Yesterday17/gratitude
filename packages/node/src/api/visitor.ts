import * as express from "express";
import * as path from "path";
import * as fs from "fs/promises";
import { VisitorFileListRequest } from "../models/api";
import { db } from "../services/db";
import { decryptText, encrypt } from "../services/encrypt";

export const router = express.Router();

async function decryptRequest({ key, path }: VisitorFileListRequest) {
  const database = await db;
  const share = await database.getShare(key);
  if (!share) {
    throw {
      code: -1,
      message: "分享不存在！",
    };
  }

  let password = share.password;
  if (!password) {
    // 没有密码，公开分享，使用默认密码
    // TODO: 获取默认密码
    password = "";
  }

  // 解密 path
  const relativePath = decryptText(password, Buffer.from(path, "base64"));

  return { relativePath, share, password };
}

// 访客目录结构展示接口
router.post("/list", async (req, res) => {
  try {
    const { relativePath, share, password } = await decryptRequest(req.body);
    const p = path.join(share.path, relativePath);
    const stat = await fs.stat(p);
    if (!stat.isDirectory()) {
      throw {
        code: -1,
        message: "目录不存在！",
      };
    }

    // 列目录
    const files = await fs.readdir(p);
    const result = files.map(async (file) => {
      const filePath = path.join(p, file);
      const stat = await fs.stat(filePath);
      return {
        name: file,
        isFile: stat.isFile(),
      };
    });

    res.send(
      encrypt(password, {
        code: 0,
        data: {
          name: path.basename(p),
          files: await Promise.all(result),
        },
      })
    );
  } catch (err) {
    res.json(err);
  }
});

// 访客文件获取接口
router.get("/file", async (req, res) => {
  try {
    const { relativePath, share } = await decryptRequest(
      req.params as VisitorFileListRequest
    );
    const p = path.join(share.path, relativePath);
    const stat = await fs.stat(p);
    if (!stat.isFile()) {
      throw {
        code: -1,
        message: "文件不存在！",
      };
    }

    // TODO: 对文件进行 XOR 加密
    // stream.pipe(res)
  } catch (err) {
    res.json(err);
  }
});
