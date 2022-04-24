import { NextFunction, Request, Response } from "express";
import { db } from "../services/db";

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
    next();
  }
}
