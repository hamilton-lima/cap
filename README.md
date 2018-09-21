# CAP
Screen capture tool

## Features 

- Capture the screen to the clipboard
- Save the captured screen at the desktop
- Allow configuration of the save folder by changing configuration file
- Adds Timestamp to the name of the saved file
- Adds Keyboard shortcuts : Ctrl + Print Screeen and Command + Shift + 5 
- Adds an icon to the tray bar 

## Setup

Current version is 0.0.1 and the executables are available at: https://github.com/hamilton-lima/cap/releases/tag/v0.0.1


## Build

Follow this steps to build
```
git clone https://github.com/hamilton-lima/cap.git
cd cap
npm install
npm start 
```

Mac
```
electron-packager ./ --platform=darwin --out=build
node_modules/.bin/jszip --config=release-config/release-mac.json 
```

Linux
```
electron-packager ./ --platform=linux --out=build
node_modules/.bin/jszip --config=release-config/release-linux.json 
```

Windows (needs to run on windows)
```
electron-packager ./ --platform=win32 --out=build
node_modules/.bin/jszip --config=release-config/release-windows.json 
```

## How to contribute

- Create an issue or just take an existing one by replying saying that I will do it :), see the list here: https://github.com/hamilton-lima/cap/labels/enhancement
- Code
- Use Prettier to format your files
- Send a pull request
