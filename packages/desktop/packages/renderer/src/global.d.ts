export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    gratitudeApi: import("../../preload/api").ApiClient;
    ipcRenderer: import("electron").IpcRenderer;
    removeLoading: () => void;
  }
}
