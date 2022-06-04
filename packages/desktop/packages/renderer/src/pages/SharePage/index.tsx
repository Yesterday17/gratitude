import { Table, PageHeader, Space, TableColumnType, Button } from "antd";
import { useEffect, useState } from "react";
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

export const SharePage = () => {
  // getShares
  const [shareEntry, setShareEntry] = useState<ShareEntry[]>([]);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    Promise.all([
      window.gratitudeApi.getDrives(),
      window.gratitudeApi.getShares(),
    ]).then(async ([drives, res]) => {
      console.log(drives);
      for (const r of res) {
        const drive = drives.find((drive: any) => drive.id === r.drive_id)!;
        r.drive = drive.name;
        r.path = window.path.join(
          await window.gratitudeApi.getDrivePathById(drive.id),
          r.path
        );
      }
      setShareEntry(res);
    });
  }, [refreshCount]);

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
              key="copy-password"
              onClick={() => {
                //TODO: clipboard.writeText(record.password!);
              }}
            >
              复制密码
            </a>
          )}
          <a
            key="delete"
            onClick={async () => {
              await window.gratitudeApi.deleteShare(record.key);
              setRefreshCount((r) => r + 1);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageHeader
      className="site-page-header"
      title="分享管理"
      subTitle="修改网盘系统对外的分享列表"
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
            window.gratitudeApi.createShare();
          }}
        >
          分享
        </Button>,
      ]}
    >
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
    </PageHeader>
  );
};
