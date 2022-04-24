import * as express from "express";
import { router as visitorRouter } from "./api/visitor";
import { router as userRouter } from "./api/user";
import { db } from "./services/db";

async function main() {
  const app = express();
  app.use(express.raw());
  app.use(express.json());

  const database = await db;
  // TODO: 根据 visitor prefix 分发路由
  app.use("/visitor", visitorRouter);
  // 用户路由
  app.use(await database.getSetting("user_prefix"), userRouter);

  app.listen(3010);
}
