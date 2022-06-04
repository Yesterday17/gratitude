export {};

import type { ApiClient } from "../../preload/api";

declare global {
  interface Window {
    // Expose some Api through preload script
    gratitudeApi: ApiClient;
    ipcRenderer: import("electron").IpcRenderer;
    path: import("path");
    removeLoading: () => void;
  }
}
