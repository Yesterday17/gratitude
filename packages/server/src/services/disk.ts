import { Drive, list as listDrive } from "drivelist";
import { DiskInfo, DiskType, PartitionInfo } from "../models/disk";

export async function getDiskInfo() {
  const list = await listDrive();
  // 磁盘信息
  const disks: Record<string, DiskInfo> = {};
  // 分区信息
  const partitions: PartitionInfo[] = [];

  for (const disk of list) {
    disks[disk.raw] = {
      realId: disk.raw,
      type: guessDiskType(disk),
    };

    disk.mountpoints.forEach((partition) => {
      partitions.push({
        name: partition.label,
        path: partition.path,
        diskId: disk.raw,
      });
    });
  }

  return { disks: Object.values(disks), partitions };
}

function guessDiskType(disk: Drive): DiskType {
  if (disk.raw.toLowerCase().includes("nvme") || disk.busType === "NVME") {
    return DiskType.SSD;
  } else if (disk.raw.toLocaleLowerCase().startsWith("/dev/sd")) {
    return DiskType.HDD;
  } else {
    // TODO: 测速
    return DiskType.HDD;
  }
}
