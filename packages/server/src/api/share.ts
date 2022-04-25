import { ShareCreateRequest, ShareEntry } from "../models/api";
import { db } from "../services/db";
import { randomHex } from "../services/hash";
import { decodeBodyJson, needLogin } from "./auth";
import { router } from "./user";

router.get("/share", needLogin, async (req, res) => {
  const database = await db;
  const shares = await database.getShares();
  res.json(shares);
});

router.post("/share", needLogin, async (req, res) => {
  const database = await db;
  const data: ShareCreateRequest = decodeBodyJson(req.body);
  const password = data.password ? randomHex(16) : undefined;
  const share = await database.createShare(
    data.driveId,
    data.path,
    data.strategy,
    data.files,
    password
  );

  const passwordAppendix = password ? `&pwd=${password}` : "";
  const response: ShareEntry = {
    driveId: data.driveId,
    files: data.files,
    key: share.key,
    password,
    path: data.path,
    strategy: data.strategy,
    url: `${req.protocol}://${req.get("host")}/${share.prefix}/#sid=${
      share.key
    }${passwordAppendix}`,
  };
  res.json(response);
});

router.delete("/share/:id", needLogin, async (req, res) => {
  const database = await db;
  const id = req.params.id;
  await database.deleteShare(id);
  res.json({});
});
