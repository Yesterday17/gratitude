import { ipcRenderer } from "electron";

export const ApiClient = {
  async getDrives() {
    return ipcRenderer.invoke("api-request/drives");
  },

  async getDrivePathById(id: number) {
    return ipcRenderer.invoke("api-request/drivePath", id);
  },

  async getShares() {
    return ipcRenderer.invoke("api-request/shares");
  },

  async createShare() {
    /** TODO:
      driveId: number,
      path: string,
      strategy: number,
      files: string[],
      password?: string
     */
    return ipcRenderer.invoke("api-request/add-share", 1, "下载", 0, [], "");
  },

  async deleteShare(key: string) {
    return ipcRenderer.invoke("api-request/delete-share", key);
  },

  async getSetting(key: string) {
    return ipcRenderer.invoke("api-request/get-setting", key);
  },
};
