import type { DriveRow } from "@gratitude/server/dist/models/db";
import { ipcRenderer } from "electron";

export const ApiClient = {
  async getDrives(): Promise<DriveRow[]> {
    return ipcRenderer.invoke("api-request/drives");
  },

  async getDrivePathById(id: number) {
    return ipcRenderer.invoke("api-request/drivePath", id);
  },

  async getShares() {
    return ipcRenderer.invoke("api-request/shares");
  },

  async createShare(
    path: string,
    strategy: number,
    files: string[],
    password?: string
  ) {
    return ipcRenderer.invoke(
      "api-request/add-share",
      path,
      strategy,
      files,
      password
    );
  },

  async deleteShare(key: string) {
    return ipcRenderer.invoke("api-request/delete-share", key);
  },

  async getSetting(key: string) {
    return ipcRenderer.invoke("api-request/get-setting", key);
  },
};
