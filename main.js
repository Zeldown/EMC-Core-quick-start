// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

const { ipcMain } = require('electron');

const { MCAuth, MCLaunch } = require('emc-core');

const launcher = new MCLaunch();

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.setMenuBarVisibility(false)

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("play", (event, username, password) => {
  let authenticator;

  MCAuth.auth(username, password).then(user => {
    authenticator = user;
    
    let opts = {
      url: "http://zeldown.com/minecraft/emc-core-quick-start/",
      overrides: {
        detached: false
      },
      authorization: authenticator,
      root: process.env.APPDATA + "/.emc-core-quick-start",
      version: "1.16.5",
      memory: {
          max: "6G",
          min: "4G"
      }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => event.reply("log", "[DEBUG]" + e));
    launcher.on('data', (e) => event.reply("log", "[DATA]" + e));
    launcher.on('error', (e) => {
      event.reply("log", "[ERROR]" + e)
      event.reply("error");
    });

    launcher.on('verification-status', (e) => {
      event.reply("log", "[VERIFICATION] " + e.name + " (" + e.current + "/" + e.total + ")");
      event.reply("check");
    });

    launcher.on('download-status', (e) => {
      event.reply("log", "[DOWNLOAD][" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")");
      event.reply("download", e.downloadedBytes, e.bytesToDownload);
    });

    launcher.on('launch', (e) => {
      event.reply("log", "Launching minecraft");
      event.reply("launch");
    });
  }).catch(error => {
    event.reply("log", error);
    event.reply("error-login");
  })
})