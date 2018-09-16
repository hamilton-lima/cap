// Modules to control application life and create native browser window
const { app, Menu, Tray, BrowserWindow } = require("electron");
const { globalShortcut } = require("electron");

let mainWindow;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, show: false });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

function createTray() {
  if (process.platform !== "darwin") {
    tray = new Tray("cap-white.png");
  } else {
    tray = new Tray("cap.png");
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "CAP screen capture"
    },
    {
      label: "Capture",
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
  globalShortcut.register("CommandOrControl+Shift+5", () => {
    console.log("CommandOrControl+Shift+5");
    capture();
  });

  globalShortcut.register("Ctrl+PrintScreen", () => {
    console.log("Ctrl+PrintScreen");
    capture();
  });
}

function capture() {
  mainWindow.webContents.send("capture", "foo");
}

app.on("ready", createWindow);
app.on("ready", createTray);
app.on("ready", createGlobalShortcut);

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
