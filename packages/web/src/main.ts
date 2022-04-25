// 导入
import { Global } from "./global";
import { listFolder, ListFolderResponse } from "./api/list";

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
}

init();

async function submitPassword() {
  const passwordInput =
    document.querySelector<HTMLInputElement>("#gr-password");
  const password = passwordInput!.value;
  Global.password = password;

  document.querySelector("#password-box")!.classList.add("hide");
  document.querySelector("#filelist-box")!.classList.remove("hide");

  try {
    const folder = await listFolder();
    createFolderItemList(folder);
  } catch (e) {
    alert(e);
  }
}

function createFolderItemList(folder: ListFolderResponse) {
  document.querySelector("#file-list")!.innerHTML = "";
  folder.files = folder.files.sort((a, b) => {
    const aIsFolder = !a.isFile;
    const bIsFolder = !b.isFile;
    /*
     * match((aIsFolder, bIsFolder)) {
     *   (true, true) => Equal,
     *   (true, false) => LeftLarger,
     *   (false, true) => RightLarger,
     *   (false, false) => Equal,
     * }
     */
    if (aIsFolder && !bIsFolder) {
      return -1;
    } else if (!aIsFolder && bIsFolder) {
      return 1;
    } else {
      return a.name > b.name ? 1 : -1;
    }
  });
  if (Global.path !== "/") {
    folder.files.unshift({ isFile: false, name: ".." });
  }
  folder.files.forEach((child) => {
    const li = createListItem(child.name, !child.isFile);
    document.querySelector("#file-list")!.appendChild(li);
  });
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createListItem(name: string, isFolder = true) {
  const li = document.createElement("li");
  li.innerHTML = `<li class="mdui-list-item mdui-ripple">
  <i class="mdui-list-item-icon mdui-icon material-icons">${
    isFolder ? "folder" : "insert_drive_file"
  }</i>
  <div class="mdui-list-item-content">${escapeHtml(name)}</div>
</li>`;
  li.addEventListener("click", async () => {
    if (isFolder) {
      if (name === "..") {
        Global.path = Global.path.substring(0, Global.path.length - 1);
        const pos = Global.path.lastIndexOf("/");
        Global.path = Global.path.substring(0, pos + 1);
      } else {
        Global.path += name + "/";
      }
      console.log(Global.path);
      try {
        const folder = await listFolder();
        createFolderItemList(folder);
      } catch (e) {
        alert(e);
      }
    } else {
      // TODO: Download
    }
  });
  return li;
}
