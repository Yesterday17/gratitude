export interface DiskInfo {
  realId: string;
  type: DiskType;
}

export const enum DiskType {
  HDD = 0,
  SSD = 1,
}

export interface PartitionInfo {
  name: string;
  path: string;
  diskId: string;
}
