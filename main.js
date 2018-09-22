const { app, Menu, Tray, BrowserWindow } = require("electron");
const { globalShortcut } = require("electron");
const path = require("path");
const package = require( path.join(__dirname, "package.json") );

let mainWindow;
let cropWindow;
let tray = null;

let shortcut = "Ctrl+PrintScreen";
let shortcutCrop = "Ctrl+Shift+PrintScreen";

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, show: false });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

function createCropWindow() {
  cropWindow = new BrowserWindow({ width: 800, height: 600, show: true });
  cropWindow.loadFile("crop.html");
  cropWindow.on("closed", function() {
    cropWindow = null;
  });
}

function createTray() {
  var trayiconName = path.join(__dirname, "cap-white.png");

  if (process.platform == "darwin") {
    trayiconName = path.join(__dirname, "cap.png");
  }

  console.log("Creating tray icon " + trayiconName);
  tray = new Tray(trayiconName);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "CAP screen capture " + package.version,
      type: "normal"
    },
    {
      label: "Capture " + shortcut,
      click() {
        console.log("click capture");
        capture();
      }
    },
    {
      label: "Select area " + shortcutCrop,
      click() {
        console.log("click select area");
        crop();
      }
    },
    {
      label: "Exit",
      click() {
        app.exit();
      }
    }
  ]);

  tray.setToolTip("CAP screen capture");
  tray.setContextMenu(contextMenu);
}

function createGlobalShortcut() {

  if (process.platform == "darwin") {
    shortcut = "CommandOrControl+Shift+5"
    shortcutCrop = "CommandOrControl+Shift+6";
  } 

  globalShortcut.register(shortcut, () => {
    console.log("shortcut pressed: " + shortcut);
    capture();
  });

  globalShortcut.register(shortcutCrop, () => {
    console.log("shortcutCrop pressed: " + shortcutCrop);
    crop();
  });

}

function capture() {
  mainWindow.webContents.send("capture", "foo");
}

function crop() {
  if( cropWindow == null ){
    createCropWindow();
  } else {
    console.log("crop window already open");
  }
}

app.on("ready", createWindow);
app.on("ready", createGlobalShortcut);
app.on("ready", createTray);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
