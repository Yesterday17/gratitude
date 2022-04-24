// MDUI 样式部分
// @ts-ignore
import mdui from "mdui";
import "mdui/dist/css/mdui.css";

// 自定义样式
import "./style.css";

document
  .querySelector("#gr-submit-password")!
  .addEventListener("click", submitPassword);

function submitPassword() {
  const passwordInput =
    document.querySelector<HTMLInputElement>("#gr-password");
  const password = passwordInput!.value;
  console.log(password);
}
