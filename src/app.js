const { app, ipcMain, BrowserWindow, session, dialog } = require("electron");
const isDevelop = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

const path = require("path");
const url = require("url");

let mainWindow = null;

function localUrl() {
  let returnUrl;
  if (isDevelop) {
    returnUrl = "http://localhost:9696/";
  } else {
    returnUrl = url.format({
      pathname: path.join(__dirname, "..", "frontend", "dist", `index.html`),
      protocol: "file",
      slashes: true,
    });
  }
  return returnUrl;
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  console.log("app window-all-closed");
  app.quit();
});

app.once("ready", () => {
  mainWindow = new BrowserWindow({
    //name
    title: `Lemmy Modder (v${app.getVersion()})`,
    icon: `${__dirname}/icon/Lemmy_Logo.png`,
    width: 950,
    height: 1000,
    show: false,
    webPreferences: {
      webSecurity: false,
      preload: `${__dirname}/preload.js`,
    },
  });

  autoUpdater.checkForUpdatesAndNotify();

  const loadUrl = localUrl();
  mainWindow.loadURL(loadUrl);

  mainWindow.removeMenu();

  if (isDevelop) {
    mainWindow.webContents.openDevTools({
      mode: "detach",
    });
  }

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.shift && input.key.toLowerCase() === "k") {
      event.preventDefault();
      mainWindow.webContents.openDevTools({
        mode: "detach",
      });
    }
  });

  ipcMain.handle("clear_storage", async (event, keepLocal = false) => {
    let keep = [
      `cookies`,
      `filesystem`,
      `indexdb`,
      `shadercache`,
      `websql`,
      `serviceworkers`,
      `cachestorage`,
    ];
    if (!keepLocal) keep.push(`localstorage`);
    try {
      await session.defaultSession.clearStorageData({
        storages: keep,
      });
      await session.defaultSession.clearAuthCache();
      await session.defaultSession.clearCache();
      await session.defaultSession.clearCodeCaches([]);
      console.log("cleared all caches", keepLocal);

      return true;
    } catch (err) {
      console.error("failed to clear cache!", err);

      return false;
    }
  });

  // this lets us set cookies for the users lemmy instance so it's already loggeed in
  ipcMain.handle("set_jwt", async (event, instanceBase, userJwt) => {
    const cookie = {
      url: `http://${instanceBase}`,
      name: "jwt",
      value: userJwt,
    };
    session.defaultSession.cookies.set(cookie, (error) => {
      if (error) console.error(error);
    });
  });

  // set origin to always match request (for lemmy mainly)
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ["*://*/*"],
    },
    (details, callback) => {
      details.requestHeaders["Origin"] = null;
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  // when a new window is going to be opened
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
      // overrideBrowserWindowOptions: {
      //   parent: mainWindow,
      // },
    };
  });

  // when window is created
  mainWindow.webContents.on(
    "did-create-window",
    (window, { url, frameName }) => {
      // set size
      window.setSize(1300, 900);
      window.removeMenu();
    }
  );

  // show main window
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});
