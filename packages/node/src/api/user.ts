import * as express from "express";
import { db } from "../services/db";
import { decryptRSA, encrypt } from "../services/encrypt";

export const router = express.Router();
router.get("/info", async (req, res) => {
  const database = await db;

  const keyId: string = req.headers.authorization;
  const keySecret = await database.getKeySecret(keyId);
  if (!keySecret) {
    // 未登录状态
    res.json({
      code: 0,
      data: {
        isLogin: false,
        pubKey: database.getSetting("info_pub_key"),
      },
    });
  } else {
    // 已登录，返回基本信息
    res.send(
      encrypt(keySecret, {
        code: 0,
        data: {
          isLogin: true,
          salt: "123", // TODO: 这个 salt 可能没什么用
          drives: await database.getDrives(),
          partitions: await database.getPartitions(),
          disks: await database.getDisks(),
        },
      })
    );
  }
});

router.post("/login", async (req, res) => {
  const database = await db;
  // 1. 解密请求
  const { key, password }: { key: string; password: string } = decryptRSA(
    await database.getSetting("info_pri_key"),
    req.body
  );

  // 2. 校验密码(bcrypt)
  if (password === "FIXME") {
    // 3. 登录成功，生成新 (key, secret)
    const keyPair = await database.createKeyPair();
    res.send(
      encrypt(key, {
        code: 0,
        data: keyPair,
      })
    );
  } else {
    // 3. 登录失败，返回错误
    res.send(
      encrypt(key, {
        code: -1,
        message: "密码错误！",
      })
    );
  }
});
