// Modules to control application life and create native browser window
const { app, Menu, Tray, BrowserWindow } = require("electron");

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
  tray = new Tray("cap-white.png");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "CAP screen capture"
    },
    {
      label: "Capture",
      click() {
        console.log("click capture");
        mainWindow.webContents.send("capture", "foo");
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

app.on("ready", createWindow);
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
