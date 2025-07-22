const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false, // Create a frameless window
    backgroundColor: '#1e293b', // Match app background color to prevent white flash
    // icon: path.join(__dirname, 'build', 'icon.ico'), // Set app icon - REMOVED due to invalid file
    webPreferences: {
      // It's recommended to turn off nodeIntegration and enable contextIsolation for security.
      // However, for simplicity and compatibility with some patterns, we leave them as is.
      nodeIntegration: true,
      contextIsolation: false,
    },
    minWidth: 940,
    minHeight: 600,
  });

  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  
  // Handle window control events from renderer process
  ipcMain.on('minimize-app', () => {
    win.minimize();
  });

  ipcMain.on('maximize-app', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-app', () => {
    win.close();
  });

  // Send window state back to renderer for UI updates
  win.on('maximize', () => {
    win.webContents.send('window-is-maximized');
  });

  win.on('unmaximize', () => {
    win.webContents.send('window-is-unmaximized');
  });

  ipcMain.handle('get-initial-is-maximized', () => {
    return win.isMaximized();
  });


  // Uncomment the line below to open the DevTools.
  // win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});