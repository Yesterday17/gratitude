import { ipcRenderer } from "electron";

export const ApiClient = {
  async getDrives() {
    return new Promise((resolve) => {
      ipcRenderer.send("api-request/drives");
      ipcRenderer.once("api-response/drives", (event, drives) => {
        resolve(drives);
      });
    });
  },

  async getShares() {
    return new Promise((resolve) => {
      ipcRenderer.send("api-request/shares");
      ipcRenderer.once("api-response/shares", (event, drives) => {
        resolve(drives);
      });
    });
  },

  async createShare() {
    /** TODO:
      driveId: number,
      path: string,
      strategy: number,
      files: string[],
      password?: string
     */
  },

  async deleteShare(key: string) {
    return new Promise((resolve) => {
      ipcRenderer.send("api-request/delete-share", key);
      ipcRenderer.once("api-response/delete-share", () => {
        resolve(void 0);
      });
    });
  },
};