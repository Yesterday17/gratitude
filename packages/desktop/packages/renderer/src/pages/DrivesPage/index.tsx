import {
  Button,
  PageHeader,
  Space,
  TableColumnType,
  Table,
  Drawer,
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
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
          key="open"
          onClick={() => {
            require("electron").shell.showItemInFolder(record.root);
          }}
        >
          打开目录
        </a>
        <a
          key="delete"
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

  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
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
              setVisible(true);
            }}
          >
            添加
          </Button>,
        ]}
      >
        <Table columns={columns} dataSource={driveEntry} />
      </PageHeader>
      <Drawer
        title="创建网盘"
        placement="right"
        // size="large"
        onClose={onClose}
        visible={visible}
        extra={[
          <Button
            type="primary"
            onClick={() => {
              // add drive
              setVisible(false);
            }}
          >
            提交
          </Button>,
        ]}
      >
        <div key="dragger" style={{ height: "200px" }}>
          <Dragger
            multiple={false}
            directory={true}
            beforeUpload={(file) => {
              console.log(file);
              return false;
            }}
            customRequest={(options) => {
              console.log(options.file);
            }}
          >
            <p className="ant-upload-text">点击或拖曳以选中网盘目录</p>
          </Dragger>
        </div>
      </Drawer>
    </div>
  );
};
