const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const appServe = app.isPackaged ? serve({ directory: path.join(__dirname, '../out') }) : serve({ directory: path.join(__dirname, '../out') });

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    // In dev, we can still serve the 'out' folder or hook into localhost:3000
    appServe(win).then(() => {
      win.loadURL('app://-');
    });
  }
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
