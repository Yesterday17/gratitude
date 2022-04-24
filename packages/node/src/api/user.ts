import * as express from "express";
import { db } from "../services/db";
import { decryptJSON, encrypt } from "../services/encrypt";

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
