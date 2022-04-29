import { Table, Tag, Space, TableColumnType, Button } from "antd";
import { useCallback, useEffect, useState } from "react";
// import { clipboard } from "electron";

export type ShareListResponse = ShareEntry[];

export interface ShareEntry {
  key: string;
  url: string;
  password?: string;
  drive: string;
  path: string;
  strategy: number;
  files: string[];
}

const columns: TableColumnType<ShareEntry>[] = [
  {
    title: "网盘",
    dataIndex: "drive",
    key: "drive",
  },
  {
    title: "分享 ID",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "分享路径",
    dataIndex: "path",
    key: "path",
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
          复制链接
        </a>
        {!!record.password && (
          <a
            onClick={() => {
              //TODO: clipboard.writeText(record.password!);
            }}
          >
            复制密码
          </a>
        )}
        <a
          onClick={async () => {
            await window.gratitudeApi.deleteShare(record.key);
            // TODO: refresh list
          }}
        >
          删除
        </a>
      </Space>
    ),
  },
];

export const SharePage = () => {
  // getShares
  const [shareEntry, setShareEntry] = useState<ShareEntry[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    Promise.all([
      window.gratitudeApi.getDrives(),
      window.gratitudeApi.getShares(),
    ]).then(([drives, res]) => {
      console.log(drives);
      res.forEach((r: any) => {
        const drive = drives.find((drive: any) => drive.id === r.drive_id)!;
        r.drive = drive.name;
        r.path = "/" + drive.root + "/" + r.path;
      });
      setShareEntry(res);
    });
  }, [refreshCount]);

  return (
    <>
      <div style={{ direction: "rtl", padding: "1em", paddingBottom: 0 }}>
        <Button
          type="primary"
          onClick={() => {
            // TODO: Model & create
            window.gratitudeApi.createShare();
          }}
        >
          创建分享
        </Button>
        <Button
          type="primary"
          style={{ marginRight: "1em" }}
          onClick={() => {
            setRefreshCount((r) => r + 1);
          }}
        >
          刷新
        </Button>
      </div>
      <br />
      <Table
        columns={columns}
        dataSource={shareEntry}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <p>分享ID：{record.key}</p>
              <p>
                分享策略：
                {record.strategy === 0
                  ? "全部分享"
                  : record.strategy === 1
                  ? "白名单"
                  : "黑名单"}
              </p>
              {record.strategy !== 0 && (
                <p>
                  {record.strategy === 1 ? "白名单文件：" : "黑名单文件："}
                  <br />
                  {record.files.map((file) => (
                    <p>{file}</p>
                  ))}
                </p>
              )}
              <p>分享类型：{record.password ? "密码分享" : "公开分享"}</p>
            </div>
          ),
          rowExpandable: () => true,
        }}
      />
    </>
  );
};
