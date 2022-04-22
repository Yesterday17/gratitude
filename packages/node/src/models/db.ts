export interface ShareRow {
  id: number;
  key: string;
  password?: string;
  drive_id: number;
  path: string;
  strategy: number;
  files: string;
}

export type SettingKey =
  | "password"
  | "listen"
  | "default_share_key"
  | "info_pub_key"
  | "info_pri_key";
