// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

const { ipcMain } = require('electron');

const { MCAuth, MCLaunch } = require('emc-core');

const fs = require('fs');

const rootFile = ".emc-core-quickstart"

const launcher = new MCLaunch();

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 550,
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

ipcMain.on("getLauncherOpts", (event) => {
  if(fs.existsSync(process.env.APPDATA + "/" + rootFile + "/launcheropts.json")) {
    let rawData = fs.readFileSync(process.env.APPDATA + "/" + rootFile + "/launcheropts.json")
    let json = JSON.parse(rawData);
    event.reply("getLauncherOpts", json['user'], json['password']);
  }
})

ipcMain.on("play", (event, username, password, check, save, ramMin, ramMax) => {
  let authenticator;

  MCAuth.auth(username, password).then(user => {
    authenticator = user;

    if(save) {
      let toSave = '{"user":"' + username + '", "password":"' + password + '"}';
      console.log(toSave);
      let toSaveJson = JSON.parse(toSave);
      let toSaveString = JSON.stringify(toSaveJson, null, 4);

      if(!fs.existsSync(process.env.APPDATA + "/" + rootFile + "/launcheropts.json")) {
        fs.mkdirSync(process.env.APPDATA + "/" + rootFile, {recursive: true})
      }
      fs.writeFileSync(process.env.APPDATA + "/" + rootFile + "/launcheropts.json", toSaveString);
    }
    
    let opts = {
      url: "http://zeldown.com/emc-core/exemple/",
      overrides: {
        detached: false
      },
      authorization: authenticator,
      root: process.env.APPDATA + "/" + rootFile,
      version: "1.15.2",
      forge: "1.15.2-forge-31.2.0",
      checkFiles: check,
      memory: {
          max: ramMax + "G",
          min: ramMin + "G"
      }
    }

    launcher.launch(opts);

    launcher.on('debug', (e) => {
      console.log("[DEBUG]" + e);
      event.reply("log", "[DEBUG]" + e)
    });
    launcher.on('data', (e) => {
      console.log("[DATA]" + e);
      event.reply("log", "[DATA]" + e)
    });
    launcher.on('error', (e) => {
      console.log("[ERROR]" + e);
      event.reply("log", "[ERROR]" + e)
      event.reply("error");
    });

    launcher.on('verification-status', (e) => {
      console.log("[VERIFICATION] " + e.name + " (" + e.current + "/" + e.total + ")");
      event.reply("log", "[VERIFICATION] " + e.name + " (" + e.current + "/" + e.total + ")");
      event.reply("check", e.current, e.total);
    });

    launcher.on('download-status', (e) => {
      console.log("[DOWNLOAD][" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")");
      event.reply("log", "[DOWNLOAD][" + e.type + "] " + e.name + " (" + e.downloadedBytes + "/" + e.bytesToDownload + ")");
      if(e.downloadedBytes > e.bytesToDownload) {
        event.reply("download", e.downloadedBytes, e.downloadedBytes);
      }else {
        event.reply("download", e.downloadedBytes, e.bytesToDownload);
      }
    });

    launcher.on('launch', (e) => {
      console.log("Launching minecraft");
      event.reply("log", "Launching minecraft");
      event.reply("launch");
    });

    launcher.on('close', (e) => {
      console.log("Closing minecraft");
      event.reply("log", "Closing minecraft");
      event.reply("close");
    })
  }).catch(error => {
    event.reply("log", error);
    event.reply("error-login");
  })
})