import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "os";
import { join } from "path";
import { main as startServer, db as database } from "@gratitude/server";
import "./samples/electron-store";
import "./samples/npm-esm-packages";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
  await startServer();
  const db = await database;

  win = new BrowserWindow({
    title: "Main window",
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // IPC 事件，加在这里
  ipcMain.on("api-request/drives", (event) => {
    db.getDrives().then((drives) => {
      event.reply("api-response/drives", drives);
    });
  });
  ipcMain.on("api-request/drivePath", (event, driveId) => {
    db.getDrivePathById(driveId).then((path) => {
      event.reply("api-response/drivePath", path);
    });
  });

  ipcMain.on("api-request/shares", (event) => {
    db.getShares().then((shares) => {
      event.reply("api-response/shares", shares);
    });
  });

  ipcMain.on(
    "api-request/add-share",
    (
      event,
      driveId: number,
      path: string,
      strategy: number,
      files: string[],
      password?: string
    ) => {
      db.createShare(driveId, path, strategy, files, password).then(() => {
        event.reply("api-response/add-share");
      });
    }
  );

  ipcMain.on("api-request/delete-share", (event, key: string) => {
    db.deleteShare(key).then(() => {
      event.reply("api-response/delete-share");
    });
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
