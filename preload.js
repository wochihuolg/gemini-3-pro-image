const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Open save dialog and write file (supports data URL or remote URL)
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),

  // Download a URL to a specific path
  downloadUrl: (options) => ipcRenderer.invoke('download-url', options),

  // Pick a save path without writing
  pickSavePath: (options) => ipcRenderer.invoke('pick-save-path', options),

  // Listen for menu events
  onMenuExportConfig: (callback) => {
    ipcRenderer.on('menu-export-config', callback);
    return () => ipcRenderer.removeListener('menu-export-config', callback);
  },
});
