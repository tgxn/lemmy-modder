const { app, BrowserWindow, session } = require("electron");

let mainWindow = null;

app.once("ready", () => {
  mainWindow = new BrowserWindow({
    width: 850,
    height: 1000,
    show: false,
  });
  mainWindow.loadURL("http://localhost:9696/");
  mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools({
    mode: "detach",
  });

  // set origin to always match request
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ["*://*/*"],
    },
    (details, callback) => {
      const urlObject = new URL(details.url);
      details.requestHeaders[
        "Origin"
      ] = `${urlObject.protocol}//${urlObject.hostname}`;
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  );

  // when a new window is going to be opened
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        parent: mainWindow,
        frame: true,
        skipTaskbar: true,
        modal: true,
        menu: null,
      },
    };
  });

  // when window is created
  mainWindow.webContents.on(
    "did-create-window",
    (window, { url, frameName }) => {
      window.setMenu(null);
    }
  );

  // show main window
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});
