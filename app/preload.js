const { contextBridge, ipcRenderer } = require("electron");

process.once("loaded", () => {
  console.log("Preload Script");

  // this object is detected in the react webapp, it should provide all remote executuion functions/params that are required when running under electron.
  contextBridge.exposeInMainWorld("modder", {
    setLemmyCookie: (instanceBase, userJwt) => {
      return ipcRenderer.invoke("set_jwt", instanceBase, userJwt);
    },
  });
});
