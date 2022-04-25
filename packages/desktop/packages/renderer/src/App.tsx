import styles from "@/styles/app.module.scss";
import { useState } from "react";
import { Row, Col, Menu, MenuProps } from "antd";
import "antd/dist/antd.css";

import { DrivesPage } from "./pages/DrivesPage";
import { SharePage } from "./pages/SharePage";
import { SettingsPage } from "./pages/SettingsPage";

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

const App = () => {
  const [route, setRoute] = useState("drives");

  return (
    <>
      <Row style={{ height: "100%" }}>
        <Col span={6}>
          <Menu
            items={[
              getItem("网盘管理", "drives", () => setRoute("drives")),
              getItem("分享管理", "share", () => setRoute("share")),
              getItem("设置", "settings", () => setRoute("settings")),
            ]}
          />
        </Col>
        <Col span={18}>
          {route === "drives" ? (
            <DrivesPage />
          ) : route === "share" ? (
            <SharePage />
          ) : (
            <SettingsPage />
          )}
        </Col>
      </Row>
    </>
  );
};

export default App;
