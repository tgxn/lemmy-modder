const { contextBridge, ipcRenderer } = require("electron");

process.once("loaded", () => {
  contextBridge.exposeInMainWorld("modder", {
    setLemmyCookie: (instanceBase, userJwt) => {
      return ipcRenderer.invoke("set_jwt", instanceBase, userJwt);
    },

    clearStorage: (keepUsers) => {
      return ipcRenderer.invoke("clear_storage", keepUsers);
    },
  });
});
