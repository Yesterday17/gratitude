export interface ShareRow {
  id: number;
  key: string;
  password?: string;
  drive_id: number;
  path: string;
  strategy: number;
  files: string;
}

export interface ShareRowResponse {
  id: number;
  key: string;
  password?: string;
  drive_id: number;
  path: string;
  strategy: number;
  files: string[];
}

export type SettingKey =
  | "password"
  | "listen"
  | "default_share_key"
  | "info_pub_key"
  | "info_pri_key"
  | "user_prefix";

export interface KeyRow {
  key_id: string;
  key_secret: string;
}

export interface DriveRow {
  id: number;
  name: string;
  root: string;
  partition: number;
}

export interface PartitionRow {
  id: number;
  name: string;
  path: string;
  disk: number;
}

export interface DiskRow {
  id: number;
  type: number;
  real_id: string;
}
