import { NextFunction, Request, Response } from "express";
import { db } from "../services/db";
import { decrypt, encrypt } from "../services/encrypt";

function wrapResponseJson(res: Response) {
  // 修改定义，jsonp 返回未加密的 json
  res.jsonp = res.json;

  res.json = (data: any) => {
    let encrypted = encrypt(res.locals.keySecret, {
      code: 0,
      data: data,
    });
    return res.status(200).send(encrypted);
  };
}

export async function needLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const database = await db;

  const keyId: string = req.headers.authorization;
  const keySecret = await database.getKeySecret(keyId);
  if (!keySecret) {
    // 未登录状态
    res.json({
      code: -1,
      message: "用户未登录！",
    });
  } else {
    res.locals.keySecret = keySecret;
    wrapResponseJson(res);
    try {
      req.body = decrypt(keySecret, req.body);
      next();
    } catch (e) {
      res.json(e);
    }
  }
}
