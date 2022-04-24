import * as express from "express";
import { db } from "../services/db";
import { decryptRSA, encrypt } from "../services/encrypt";
import { router } from "./user";

router.get("/share", async (req, res) => {
  const database = await db;
  const shares = await database.getShares();
  // TODO: 加密
  res.json(shares);
});

router.post("/share", async (req, res) => {
  const database = await db;
  //
});

router.delete("/share/:id", async (req, res) => {
  const database = await db;
  const id = req.params.id;
  await database.deleteShare(id);
  res.status(200).send();
});
