import * as express from "express";
import { visitorHandler } from "./api/visitor";
import { router as userRouter } from "./api/user";
import { router as adminRouter } from "./api/admin";
import { db } from "./services/db";
import { needLocal } from "./api/auth";

export async function main() {
  const app = express();
  app.use(express.raw());
  app.use(express.json());

  const database = await db;
  // 用户路由
  app.use("/" + (await database.getSetting("user_prefix")), userRouter);
  // 管理路由
  app.use("/admin", needLocal, adminRouter);
  // 根据分享前缀控制路由
  app.use(visitorHandler);

  app.listen(await database.getSetting("listen"));
}

export { db };
