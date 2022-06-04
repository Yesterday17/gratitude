import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from "electron";
import { release } from "os";
import { join } from "path";
import { main as startServer, db as database } from "@gratitude/server";
import "./samples/electron-store";
import "./samples/npm-esm-packages";
import { SettingKey } from "@gratitude/server/dist/models/db";

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

  const tray = new Tray(
    "/home/yesterday17/Code/Graduation/gratitude/packages/desktop/resources/icon.png"
  );
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "管理网盘",
        click: () => {
          win?.show();
        },
      },
      {
        label: "退出",
        click: () => {
          app.exit();
        },
      },
    ])
  );

  win = new BrowserWindow({
    title: "Main window",
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
    },
  });

  win.on("close", (evt) => {
    evt.preventDefault();
    win?.hide();
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
  ipcMain.handle("api-request/drives", () => {
    return db.getDrives();
  });

  ipcMain.handle("api-request/drivePath", (event, driveId) => {
    return db.getDrivePathById(driveId).then((path) => {
      return path;
    });
  });

  ipcMain.handle("api-request/shares", (event) => {
    return db.getShares().then((shares) => {
      return shares;
    });
  });

  ipcMain.handle(
    "api-request/add-share",
    (
      event,
      driveId: number,
      path: string,
      strategy: number,
      files: string[],
      password?: string
    ) => {
      return db.createShare(driveId, path, strategy, files, password);
    }
  );
  ipcMain.handle("api-request/delete-share", (event, key: string) => {
    return db.deleteShare(key);
  });

  ipcMain.handle("api-request/get-setting", (event, key: SettingKey) => {
    return db.getSetting(key).then((value) => {
      return value;
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
