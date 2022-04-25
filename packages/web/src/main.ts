// MDUI 样式部分
// @ts-ignore
import mdui from "mdui";
import "mdui/dist/css/mdui.css";

// 自定义样式
import "./style.css";

// 导入
import { Global } from "./global";
import { decryptResponseString } from "./utils/encrypt";
import { listFolder } from "./api/list";

function init() {
  const hash = window.location.hash;
  const hashMatch = hash.match(/^#sid=(.+?)(?:&pwd=(.+?))?$/);
  if (hashMatch) {
    const sid = hashMatch[1];
    const password = hashMatch[2];
    Global.shareId = sid;
    Global.password = password;
  }

  document
    .querySelector("#gr-submit-password")!
    .addEventListener("click", submitPassword);

  // 当有全局密码时，自动提交一次
  if (Global.password) {
    const passwordInput =
      document.querySelector<HTMLInputElement>("#gr-password");
    passwordInput!.value = Global.password;

    submitPassword();
  }

  // FIXME: remove this
  window.dec = decryptResponseString;
}

init();

async function submitPassword() {
  const passwordInput =
    document.querySelector<HTMLInputElement>("#gr-password");
  const password = passwordInput!.value;
  Global.password = password;

  try {
    const folder = await listFolder();
    // TODO: 展示目录内容
    console.log(folder);
  } catch (e) {
    alert(e);
  }
}
