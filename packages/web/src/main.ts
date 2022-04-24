// MDUI 样式部分
// @ts-ignore
import mdui from "mdui";
import "mdui/dist/css/mdui.css";

// 自定义样式
import "./style.css";

// 导入
import { Global } from "./global";
import { encryptPath, decryptResponse } from "./utils/encrypt";
import { fromBase64 } from "@aws-sdk/util-base64-browser";

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
  const decrypted = await decryptResponse(fromBase64(encrypted));
  console.log(decrypted);
}
