import * as express from "express";
import { db } from "../services/db";
import { decryptRSA, encrypt } from "../services/encrypt";
import * as webdav from "webdav-server";

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
        pubKey: await database.getSetting("info_pub_key"),
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
  if (await database.validatePassword(password)) {
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

const servers: Map<number, webdav.v2.WebDAVServer> = new Map();

router.use("/drive/:id", async (req, res, next) => {
  const database = await db;
  const id = parseInt(req.params.id);
  if (!servers.has(id)) {
    const drivePath = await database.getDrivePathById(id);
    if (drivePath) {
      servers.set(
        id,
        new webdav.v2.WebDAVServer({
          rootFileSystem: new webdav.v2.PhysicalFileSystem(drivePath),
        })
      );
    } else {
      servers.set(id, undefined);
    }
  }

  if (!servers.get(id)) {
    next();
    return;
  }

  req.url = req.url.replace(/^\/drive\/\d+/, "");
  servers
    .get(id)
    .executeRequest(
      req,
      res,
      `/${await database.getSetting("user_prefix")}/drive/${id}`
    );
});
