const {
  app,
  BrowserWindow,
  Menu,
  focusedWindow,
  Tray,
  ipcMain
} = require("electron");
const url = require("url");
const path = require("path");
const { autoUpdater } = require("electron-updater");

let main;

app.setAppUserModelId("treatlab.com");
app.on("ready", () => {
  main = new BrowserWindow({
    webPreferences: { backgroundThrottling: false }
  });
  main.loadURL(
    url.format({
      pathname: path.join(__dirname, "public/login.html"),
      protocol: "file",
      slashes: true
    })
  );
  autoUpdater.checkForUpdates();

  const mainMenu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(mainMenu);

  main.on("closed", () => {
    app.quit();
  });
});

autoUpdater.on("update-downloaded", info => {
  main.webContents.send("updateReady");
});

ipcMain.on("quitAndInstall", (event, arg) => {
  autoUpdater.quitAndInstall();
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];


if (process.platform === "darwin") {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
  menuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform === "darwin" ? "Command+I" : "Ctrl+I",
        click(Item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}
