const { app, ipcMain, BrowserWindow, session } = require("electron");

let mainWindow = null;

app.once("ready", () => {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 1000,
    show: false,
    webPreferences: {
      webSecurity: false,
      preload: `${__dirname}/preload.js`,
    },
  });
  mainWindow.loadURL("http://localhost:9696/");
  mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools({
    mode: "detach",
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
      overrideBrowserWindowOptions: {
        parent: mainWindow,
      },
    };
  });

  // when window is created
  mainWindow.webContents.on(
    "did-create-window",
    (window, { url, frameName }) => {
      // set size
      window.setSize(1300, 900);
      window.setMenu(null);
    }
  );

  // show main window
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});
