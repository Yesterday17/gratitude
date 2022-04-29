import { Button, PageHeader, Space, TableColumnType, Table } from "antd";
import { useEffect, useState } from "react";

interface DriveRow {
  id: number;
  name: string;
  root: string;
  partition: number;
}

const columns: TableColumnType<DriveRow>[] = [
  {
    title: "网盘ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "网盘名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "网盘根目录",
    dataIndex: "root",
    key: "root",
  },
  {
    title: "动作",
    key: "action",
    render: (text, record) => (
      <Space size="middle">
        <a
          onClick={() => {
            //TODO: clipboard.writeText(record.url);
          }}
        >
          打开目录
        </a>
        <a
          onClick={async () => {
            // await window.gratitudeApi.deleteShare(record.key);
            // TODO: refresh list
          }}
        >
          删除网盘
        </a>
      </Space>
    ),
  },
];

export const DrivesPage = () => {
  const [refreshCount, setRefreshCount] = useState(0);

  const [driveEntry, setDriveEntry] = useState<DriveRow[]>([]);

  useEffect(() => {
    window.gratitudeApi.getDrives().then(async (drives: DriveRow[]) => {
      for (const drive of drives) {
        drive.root = await window.gratitudeApi.getDrivePathById(drive.id);
      }
      setDriveEntry(drives);
    });
  }, [refreshCount]);

  return (
    <PageHeader
      className="site-page-header"
      title="网盘管理"
      subTitle="修改网盘列表"
      extra={[
        <Button
          key="1"
          onClick={() => {
            setRefreshCount((r) => r + 1);
          }}
        >
          刷新
        </Button>,
        <Button
          key="2"
          type="primary"
          onClick={() => {
            // TODO: Model & create
            // window.gratitudeApi.createShare();
          }}
        >
          添加
        </Button>,
      ]}
    >
      <Table columns={columns} dataSource={driveEntry} />
    </PageHeader>
  );
};
