import { Database as DatabaseDriver } from "sqlite3";
import { open, Database } from "sqlite";
import { check as checkDiskUsage } from "diskusage";
import {
  DiskRow,
  DriveRow,
  KeyRow,
  PartitionRow,
  SettingKey,
  ShareRow,
} from "../models/db";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { randomHex } from "./hash";
import * as fs from "fs/promises";
import { getDiskInfo } from "./disk";
import { generateKeyPair } from "./encrypt";
import * as path from "path";

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
path      TEXT NON NULL,
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
  prefix    TEXT NON NULL,
  FOREIGN KEY("key") REFERENCES "gr_share"("key")
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
    // 检查初始化设置
    const manager = new DatabaseManager(db);
    if (await manager.isEmpty()) {
      // 初始化设置
      const password = randomHex(16);
      console.log("password = " + password);

      const key = generateKeyPair();
      manager.addSetting("info_pub_key", key.publicKey);
      manager.addSetting("info_pri_key", key.privateKey);
      manager.addSetting("user_prefix", randomHex(16));
      manager.addSetting("default_share_key", randomHex(16));
      manager.addSetting("password", await bcrypt.hash(password, 10));
      manager.addSetting("listen", "3010");

      // 初始化分区
      const { disks, partitions } = await getDiskInfo();
      const diskId: Record<string, number> = {};
      for (const disk of disks) {
        await db.run("INSERT INTO gr_disks(type, real_id) VALUES(?, ?)", [
          disk.type,
          disk.realId,
        ]);
        const { id }: { id: number } = await db.get(
          "SELECT id FROM gr_disks WHERE real_id = ?",
          [disk.realId]
        );
        diskId[disk.realId] = id;
      }

      for (const partition of partitions) {
        await db.run(
          "INSERT INTO gr_partitions(name, path, disk) VALUES(?, ?, ?)",
          [partition.name, partition.path, diskId[partition.diskId]]
        );
      }
    }

    return manager;
  }

  private constructor(db: Database) {
    this.db = db;
  }

  async isEmpty(): Promise<boolean> {
    const { count } = await this.db.get(
      "SELECT COUNT(*) AS count FROM gr_settings"
    );
    return count === 0;
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
    const { value }: { value: string } = await this.db.get(
      "SELECT value FROM gr_settings WHERE key = ?",
      key
    );
    return value;
  }

  async addSetting(key: SettingKey, value: string) {
    await this.db.run("INSERT INTO gr_settings(key, value) VALUES(?, ?)", [
      key,
      value,
    ]);
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
      const data = await this.db.get(
        "SELECT secret FROM gr_keys WHERE key = ?",
        key
      );
      if (data) {
        return data.secret;
      }
    }
    return undefined;
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
    // 创建分享
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
    // 生成前缀
    const prefix = randomHex(16);
    // 创建前缀
    await this.db.run("INSERT INTO gr_share_prefix(key, prefix) VALUES(?, ?)", [
      key,
      prefix,
    ]);

    return { key, prefix };
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
    const { prefix } = await this.db.get(
      "SELECT prefix FROM gr_share_prefix WHERE key = ?",
      key
    );
    return prefix;
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

  async getPartitions(): Promise<PartitionRow[]> {
    return await this.db.all("SELECT * FROM gr_partitions");
  }

  async getDisks(): Promise<DiskRow[]> {
    return await this.db.all("SELECT * FROM gr_disks");
  }

  async createDrive(name: string, root: string) {
    if (!(await fs.stat(root)).isDirectory()) {
      throw {
        code: -1,
        message: "非法目录或目录不存在！",
      };
    }

    const fullPath = path.resolve(root);
    let partition: PartitionRow | null = null;
    const partitions = await this.getPartitions();
    for (const p of partitions) {
      if (fullPath.startsWith(p.path)) {
        if (partition == null || partition.path.length < p.path.length) {
          partition = p;
        }
      }
    }

    await this.db.run(
      "INSERT INTO gr_drives(name, root, partition) VALUES(?, ?, ?)",
      [name, path.relative(partition.path, fullPath), partition!.id]
    );
  }

  async removeDrive(id: number) {
    // 删除网盘目录
    await this.db.run("DELETE FROM gr_drives WHERE id = ?", id);
    // 删除分享
    await this.db.run("DELETE FROM gr_share WHERE drive_id = ?", id);
  }
}

export const db = DatabaseManager.init(
  process.env.GR_DATABASE_PATH || "drive.db"
);
