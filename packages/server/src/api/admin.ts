import * as express from "express";
import { DriveCreateRequest } from "../models/api";
import { db } from "../services/db";
import { encryptPassword } from "../services/encrypt";

export const router = express.Router();

router.post("/drive", async (req, res) => {
  const database = await db;
  const data: DriveCreateRequest = req.body;

  await database.createDrive(data.name, data.path);
  res.json({ code: 0, data: {} });
});

router.delete("/drive/:id", async (req, res) => {
  const database = await db;
  const id = parseInt(req.params.id);
  await database.removeDrive(id);
  res.json({ code: 0, data: {} });
});

router.post("/reset_password", async (req, res) => {
  const database = await db;
  const password = req.body.password;
  await database.updateSetting("password", await encryptPassword(password));
  res.json({ code: 0, data: {} });
});
