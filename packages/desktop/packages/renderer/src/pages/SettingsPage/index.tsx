import {
  Button,
  Descriptions,
  PageHeader,
  Input,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useState } from "react";

export const SettingsPage = () => {
  const [value, setValue] = useState(0);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

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
      <Descriptions size="small" column={2}>
        <Descriptions.Item label="登录密码">
          <Input.Password size="small" />
        </Descriptions.Item>
        <div></div>

        <Descriptions.Item label="监听地址">
          <Input size="small" />
        </Descriptions.Item>
        <div></div>

        <Descriptions.Item label="删除策略">
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={0}>直接删除</Radio>
            <Radio value={1}>移动到回收站</Radio>
          </Radio.Group>
        </Descriptions.Item>
        <div></div>

        <Descriptions.Item label="系统前缀">
          MgKq_VIb4BLr5hnxdkjzDw
        </Descriptions.Item>
        <div></div>
      </Descriptions>
    </PageHeader>
  );
};
