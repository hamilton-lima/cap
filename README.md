# CAP
Screen capture tool

## Features 

- Capture the screen to the clipboard
- Save the captured screen at the desktop
- Adds Timestamp to the name of the saved file
- Adds Keyboard shortcuts : Ctrl + Print Screeen and Command + Shift + 5 
- Adds an icon to the tray bar 

## Setup

There is no installer for now, please follow the steps bellow
```
git clone https://github.com/hamilton-lima/cap.git
cd cap
npm install
npm start 
```
## Build

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


## Next steps

- Create installer using https://www.npmjs.com/package/electron-forge
- Create crop capture alternative using transparent window over the entire window http://electron.rocks/transparent-window/
- Add support to fixed size captures
- Create visual tool to annotate the captures
- Keep track of the list of captures to edit the annotations
- Add auto run using https://www.npmjs.com/package/auto-launch
- Allow target folder customization

