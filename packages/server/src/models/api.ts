export type Response<T> = SuccessResponse<T> | FailedResponse;

export interface SuccessResponse<T> {
  code: number;
  data: T;
}

export interface FailedResponse {
  code: 0;
  message: string;
}

export interface SiteInfoResponse {
  // 尚未登录
  is_login: false;
  // 用于登录时加密密码的 Public Key
  pub_key: string;
}

export interface SiteDetailResponse {
  // 已经登录
  is_login: true;
  // 可用的网盘信息
  drives: DriveInfoResponse[];
  // 分区
  partitions: PartitionInfoResponse[];
  // 磁盘信息
  disks: DiskInfoResponse[];
}

export interface DriveInfoResponse {
  // 网盘目录的 ID
  id: string;
  // 网盘目录的名称
  name: string;
  // 网盘目录所在的目录
  folder: string;
  // 网盘目录所在的分区 ID
  partition: number;
}

export interface PartitionInfoResponse {
  // 分区 ID
  id: string;
  // 分区名
  name: string;
  // 分区剩余空间
  freeBytes: number;
  // 分区大小
  totalBytes: number;
}

export interface DiskInfoResponse {
  // 磁盘 ID
  id: string;
  // 磁盘类型
  type: string;
}

export interface LoginRequest {
  key: string;
  password: string;
}

export interface LoginResponse {
  key_id: string;
  key_secret: string;
}

export type ShareListResponse = ShareEntry[];

export interface ShareEntry {
  key: string;
  url: string;
  password?: string;
  driveId: number;
  path: string;
  strategy: number;
  files: string[];
}

export interface ShareCreateRequest {
  driveId: number;
  path: string;
  strategy: number;
  files: string[];
  password?: boolean;
}

export interface VisitorFileListRequest {
  key: string;
  path: string;
}

export interface DriveCreateRequest {
  name: string;
  path: string;
}
