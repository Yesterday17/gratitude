import { Table, Tag, Space, TableColumnType, Button } from "antd";
// import { clipboard } from "electron";

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

const columns: TableColumnType<ShareEntry>[] = [
  {
    title: "分享内容",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "所处网盘",
    dataIndex: "driveId",
    key: "driveId",
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
            // clipboard.writeText(record.url);
          }}
        >
          复制链接
        </a>
        {!!record.password && (
          <a
            onClick={() => {
              // clipboard.writeText(record.password!);
            }}
          >
            复制密码
          </a>
        )}
      </Space>
    ),
  },
];

const data: ShareEntry[] = [
  {
    key: "1",
    driveId: 1,
    url: "https://www.google.com",
    files: ["123"],
    path: "/",
    strategy: 0,
    // password: "123",
  },
];

export const SharePage = () => {
  return (
    <>
      <Button type="primary">Primary Button</Button>
      <br />
      <Table
        columns={columns}
        dataSource={data}
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
