import { Global } from "../global";
import { encryptPath } from "../utils/encrypt";
import { handleResponse } from "./common";

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

  return await fetch("list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(handleResponse(false));
}
