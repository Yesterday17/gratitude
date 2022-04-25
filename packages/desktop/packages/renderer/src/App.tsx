import styles from "@/styles/app.module.scss";
import { useState } from "react";
import { Row, Col, Menu, MenuProps } from "antd";
import "antd/dist/antd.css";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  onClick: () => void,
  icon?: React.ReactNode,
  type?: "group"
): MenuItem {
  return {
    key,
    label,
    onClick,
    icon,
    type,
  } as MenuItem;
}

const SharePage = () => {
  return <div>share</div>;
};

const SettingsPage = () => {
  return <div>settings</div>;
};

const App = () => {
  const [isSharePage, setIsSharePage] = useState(false);

  return (
    <>
      <Row>
        <Col span={6}>
          <Menu
            items={[
              getItem("分享管理", "share", () => setIsSharePage(true)),
              getItem("设置", "settings", () => setIsSharePage(false)),
            ]}
          />
        </Col>
        <Col span={18}>{isSharePage ? <SharePage /> : <SettingsPage />}</Col>
      </Row>
    </>
  );
};

export default App;
