import { Database as DatabaseDriver } from "sqlite3";
import { open, Database } from "sqlite";
import { check as checkDiskUsage } from "diskusage";
import { SettingKey, ShareRow } from "../models/db";

class DatabaseManager {
  private db: Database;

  static async init(dbPath: string): Promise<DatabaseManager> {
    const db = await open({ filename: dbPath, driver: DatabaseDriver });

    /////////////////////////////////////////////////////////////////////
    // 网盘信息表
    await db.exec(`
CREATE TABLE IF NOT EXISTS gr_drives(
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NON NULL,
  root      TEXT NON NULL,
  partition INTEGER NOT NULL,
  FOREIGN KEY("partition") REFERENCES "gr_partitions"("id")
);`);

    // 分区信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_partitions(
id        INTEGER PRIMARY KEY AUTOINCREMENT,
name      TEXT NON NULL,
real_id   TEXT NON NULL,
disk      INTEGER NOT NULL,
FOREIGN KEY("disk") REFERENCES "gr_disks"("id")
);`);

    // 磁盘信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_disks(
id        INTEGER PRIMARY KEY AUTOINCREMENT,
type      INTEGER NON NULL,
real_id   TEXT NON NULL
);`);

    // 分享信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_share(
id        INTEGER PRIMARY KEY AUTOINCREMENT,
key       TEXT NON NULL,
password  TEXT,
drive_id  INTEGER NON NULL,
path      TEXT NON NULL,
strategy  INTEGER NON NULL,
files     TEXT,
FOREIGN KEY("drive_id") REFERENCES "gr_drives"("id")
);`);

    // 密钥信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_keys(
id       INTEGER PRIMARY KEY AUTOINCREMENT,
key      TEXT NON NULL,
secret   TEXT NON NULL
);`);

    // 设置信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_settings(
id       INTEGER PRIMARY KEY AUTOINCREMENT,
key      TEXT NON NULL,
value    TEXT NON NULL
);`);

    /////////////////////////////////////////////////////////////////////
    // TODO: 检查初始化设置
    return new DatabaseManager(db);
  }

  private constructor(db: Database) {
    this.db = db;
  }

  async getShare(key: string): Promise<ShareRow | undefined> {
    return await this.db.get("SELECT * FROM gr_share WHERE key = ?", key);
  }

  /**
   * 获取设置项
   *
   * @param key 设置项的键
   * @returns 设置内容
   */
  async getSetting(key: SettingKey): Promise<string> {
    return await this.db.get(
      "SELECT value FROM gr_settings WHERE key = ?",
      key
    );
  }

  async addFolder(path: string) {
    const usage = await checkDiskUsage(path);
    console.group(usage);
  }
}

export const db = DatabaseManager.init(
  process.env.GR_DATABASE_PATH || "drive.db"
);
