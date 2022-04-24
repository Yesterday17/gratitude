import { Global } from "../global";
import { encryptPath } from "../utils/encrypt";

export async function listFolder() {
  const body = {
    key: "",
    path: encryptPath(Global.path),
  };

  const responseBlob = await fetch("list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((r) => r.blob());
}
