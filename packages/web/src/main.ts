// MDUI 样式部分
// @ts-ignore
import mdui from "mdui";
import "mdui/dist/css/mdui.css";

// 自定义样式
import "./style.css";

// 导入
import { Global } from "./global";
import { encryptPath } from "./utils/encrypt";

document
  .querySelector("#gr-submit-password")!
  .addEventListener("click", submitPassword);

async function submitPassword() {
  const passwordInput =
    document.querySelector<HTMLInputElement>("#gr-password");
  const password = passwordInput!.value;
  Global.password = password;
  // TODO: 校验密码，获取目录
  const encrypted = await encryptPath("/");
  console.log(encrypted);
}
