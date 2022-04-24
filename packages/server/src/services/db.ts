import { Database as DatabaseDriver } from "sqlite3";
import { open, Database } from "sqlite";
import { check as checkDiskUsage } from "diskusage";
import { DriveRow, KeyRow, SettingKey, ShareRow } from "../models/db";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { randomHex } from "./hash";

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

    // 前缀信息表
    await db.run(`
CREATE TABLE IF NOT EXISTS gr_share_prefix(
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  key       TEXT NON NULL,
  prefix    TEXT NON NULL
`);

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

  // 获取分享的行
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

  // 校验密码
  async validatePassword(password: string): Promise<boolean> {
    const actualPassword = await this.getSetting("password");
    return bcrypt.compare(password, actualPassword);
  }

  // 创建登录用户使用的 (key, secret)
  async createKeyPair(): Promise<KeyRow> {
    const key_id = crypto.randomBytes(32).toString("hex");
    const key_secret = crypto.randomBytes(32).toString("hex");
    await this.db.run("INSERT INTO gr_keys(key, secret) VALUES(?, ?)", [
      key_id,
      key_secret,
    ]);
    return { key_id, key_secret };
  }

  // 获取 key 对应的密钥
  async getKeySecret(key: string): Promise<string | undefined> {
    if (!!key) {
      return await this.db.get("SELECT secret FROM gr_keys WHERE key = ?", key);
    } else {
      return undefined;
    }
  }

  // 创建分享
  async createShare(
    driveId: number,
    path: string,
    strategy: number,
    files: string[],
    password?: string
  ) {
    // 生成随机 key
    const key = randomHex(16);
    await this.db.run(
      "INSERT INTO gr_share(key, drive_id, path, strategy, files, password) VALUES(?, ?, ?, ?, ?, ?)",
      [
        key,
        driveId,
        path,
        strategy,
        files.length === 0 ? undefined : JSON.stringify(files),
        password,
      ]
    );
    return key;
  }

  // 获取分享列表
  async getShares(): Promise<ShareRow[]> {
    return await this.db.all("SELECT * FROM gr_share");
  }

  // 删除分享
  async deleteShare(key: string): Promise<void> {
    await this.db.run("DELETE FROM gr_share WHERE key = ?", key);
  }

  // 获取分享的前缀
  async getSharePrefix(key: string): Promise<string | undefined> {
    return await this.db.get(
      "SELECT prefix FROM gr_share_prefix WHERE key = ?",
      key
    );
  }

  // 获取所有去重后的已用前缀
  async getAllSharePrefix(): Promise<string[]> {
    const rows = await this.db.all(
      "SELECT DISTINCT prefix FROM gr_share_prefix"
    );
    return rows.map((row) => row.prefix);
  }

  async getDrives(): Promise<DriveRow[]> {
    return await this.db.all("SELECT * FROM gr_drives");
  }

  async getPartitions(): Promise<DriveRow[]> {
    return await this.db.all("SELECT * FROM gr_partitions");
  }

  async getDisks(): Promise<DriveRow[]> {
    return await this.db.all("SELECT * FROM gr_disks");
  }

  async addFolder(path: string) {
    const usage = await checkDiskUsage(path);
    console.group(usage);
  }
}

export const db = DatabaseManager.init(
  process.env.GR_DATABASE_PATH || "drive.db"
);
