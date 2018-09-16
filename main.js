const { app, Menu, Tray, BrowserWindow } = require("electron");
const { globalShortcut } = require("electron");
const path = require("path");
const package = require( path.join(__dirname, "package.json") );

let mainWindow;
let tray = null;

// TODO: move to a class
let shortcut = "Ctrl+PrintScreen";

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, show: false });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
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
  } 

  globalShortcut.register(shortcut, () => {
    console.log("shortcut pressed: " + shortcut);
    capture();
  });

}

function capture() {
  mainWindow.webContents.send("capture", "foo");
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
