const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 780,
    minWidth: 640,
    minHeight: 600,
    title: 'Gemini-3-Pro-Image 生图工具',
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    show: false,
    backgroundColor: '#0f1117',
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── Menu ──
function buildMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '导出配置',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow?.webContents.send('menu-export-config'),
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { role: 'resetZoom', label: '重置缩放' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '查看使用说明',
          click: () => shell.openExternal('https://github.com/wochihuolg/gemini-3-pro-image#readme'),
        },
        {
          label: 'APIMart 官网',
          click: () => shell.openExternal('https://api.apimart.ai'),
        },
        { type: 'separator' },
        { label: `v${app.getVersion()}`, enabled: false },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── IPC Handlers ──

// Save file dialog + write
ipcMain.handle('save-file-dialog', async (event, { defaultName, dataUrl }) => {
  const ext = defaultName.match(/\.\w+$/)?.[0] || '.png';
  const filters = [
    { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'webp'] },
    { name: '所有文件', extensions: ['*'] },
  ];

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
    filters,
    properties: ['createDirectory'],
  });

  if (result.canceled || !result.filePath) return { canceled: true };

  // Decode base64 data URL or write raw buffer
  try {
    if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      const base64Data = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(result.filePath, buffer);
    } else if (dataUrl && typeof dataUrl === 'string') {
      // URL - fetch and save
      const response = await fetch(dataUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(result.filePath, buffer);
    }
    return { success: true, filePath: result.filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Download file from URL
ipcMain.handle('download-url', async (event, { url, filePath }) => {
  try {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Simple save dialog (just pick file path)
ipcMain.handle('pick-save-path', async (event, { defaultName }) => {
  const ext = defaultName?.match(/\.\w+$/)?.[0] || '.png';
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'image.png',
    filters: [
      { name: '图片文件', extensions: ['png', 'jpg', 'jpeg', 'webp'] },
      { name: '所有文件', extensions: ['*'] },
    ],
    properties: ['createDirectory'],
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  return { filePath: result.filePath };
});

// ── App Lifecycle ──
app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
