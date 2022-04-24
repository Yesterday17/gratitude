import * as express from "express";
import { db } from "../services/db";
import { encrypt } from "../services/encrypt";
import { needLogin } from "./auth";
import { router } from "./user";

router.get("/share", needLogin, async (req, res) => {
  const database = await db;
  const shares = await database.getShares();
  // TODO: 加密
  res.json(shares);
});

router.post("/share", needLogin, async (req, res) => {
  const database = await db;
  //
});

router.delete("/share/:id", needLogin, async (req, res) => {
  const database = await db;
  const id = req.params.id;
  await database.deleteShare(id);
  res.status(200).send();
});
