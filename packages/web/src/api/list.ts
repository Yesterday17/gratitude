import { Global } from "../global";
import { decryptResponse, encryptPath } from "../utils/encrypt";

interface ListFolderResponse {
  name: string;
  isFile: boolean;
  children: VisitorFolderChild[];
}

interface VisitorFolderChild {
  name: string;
  isFile: boolean;
}

export async function listFolder(): Promise<ListFolderResponse> {
  const body = {
    key: Global.shareId,
    path: await encryptPath(Global.path),
  };

  const responseBuffer = await fetch("list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((r) => r.arrayBuffer());
  const response = await decryptResponse(new Uint8Array(responseBuffer));
  return JSON.parse(response);
}
