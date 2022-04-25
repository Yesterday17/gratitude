import * as express from "express";
import { router as visitorRouter } from "./api/visitor";
import { router as userRouter } from "./api/user";
import { router as adminRouter } from "./api/admin";
import { db } from "./services/db";
import { needLocal } from "./api/auth";

async function main() {
  const app = express();
  app.use(express.raw());
  app.use(express.json());

  const database = await db;
  // TODO: 根据 visitor prefix 分发路由
  app.use("/visitor", visitorRouter);
  // 用户路由
  app.use("/" + (await database.getSetting("user_prefix")), userRouter);
  // 管理路由
  app.use("/admin", needLocal, adminRouter);

  app.listen(await database.getSetting("listen"));
}

main();
