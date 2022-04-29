import {
  Button,
  Descriptions,
  PageHeader,
  Input,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useEffect, useState } from "react";

export const SettingsPage = () => {
  const [password, setPassword] = useState("");

  const [prefix, setPrefix] = useState("");
  const [listen, setListen] = useState("0");

  const [value, setValue] = useState(0);
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    window.gratitudeApi
      .getSetting("user_prefix")
      .then((prefix: string) => setPrefix(prefix));
    window.gratitudeApi
      .getSetting("listen")
      .then((listen: string) => setListen(listen));
    window.gratitudeApi
      .getSetting("delete_strategy")
      .then((value: string) => setValue(parseInt(value) || 0));
  }, []);

  return (
    <PageHeader
      className="site-page-header"
      title="设置"
      subTitle="修改网盘系统的设置项"
      extra={[
        <Button key="1" type="primary">
          保存
        </Button>,
      ]}
    >
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="登录密码">
          <Input.Password
            size="small"
            placeholder="系统不保存明文密码，填写以修改密码"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Descriptions.Item>

        <Descriptions.Item label="监听地址">
          <Input
            size="small"
            value={listen}
            onChange={(e) => setListen(e.target.value)}
          />
        </Descriptions.Item>

        <Descriptions.Item label="删除策略">
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={0}>直接删除</Radio>
            <Radio value={1}>移动到回收站</Radio>
          </Radio.Group>
        </Descriptions.Item>

        <Descriptions.Item label="系统前缀">{prefix}</Descriptions.Item>
      </Descriptions>
    </PageHeader>
  );
};
