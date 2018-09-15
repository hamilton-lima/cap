// Modules to control application life and create native browser window
const { desktopCapturer } = require("electron");
const { app } = require("electron").remote;

// const { fullscreenScreenshot } = require("./fullscreencapture.js");

const electron = require("electron");

const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
var debug = document.getElementById("debug");

log("width / height = " + width + " / " + height);

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.

desktopCapturer.getSources({ types: ["screen"] }, (error, sources) => {
  if (error) throw error;
  log("getSources");

  for (let i = 0; i < sources.length; ++i) {
    log("getSources >>" + JSON.stringify(sources[i]));
    const id = sources[i].id;

    fullscreenScreenshot(function(base64data) {
      document.getElementById("my-preview").setAttribute("src", base64data);
      saveImage(base64data);
      copyToclipboard(base64data);
    }, "image/png");
  }
});

function copyToclipboard(base64data){
    const nativeImage = require('electron').nativeImage;
    const {clipboard} = require('electron');
    
    const image = nativeImage.createFromDataURL(base64data);
    clipboard.writeImage(image);
}

function log(message) {
  debug.innerHTML += "<br>" + message;
}

function getDesktop() {
  //   const { app } = require("electron");
  return app.getPath("desktop");
}

function getTimeStampForFileName() {
  return new Date()
    .toISOString()
    .replace("T", "_")
    .replace(/:/g, "-")
    .replace("Z", "")
    .trim();
}

function getFileName() {
  const path = require("path");
  const result = getDesktop() + path.sep + getTimeStampForFileName() + ".png";
  return result;
}

function saveImage(data) {
  var fs = require("fs");
  var base64Data;
  var binaryData;

  const fileName = getFileName();
  console.log("saving image to " + fileName);

  base64Data = data.replace(/^data:image\/png;base64,/, "");
  base64Data += base64Data.replace("+", " ");
  binaryData = new Buffer(base64Data, "base64").toString("binary");

  try {
    fs.writeFileSync(fileName, binaryData, "binary");
  } catch (e) {
    console.error("Error saving file", e);
  }

}

const { screen } = require("electron");

/**
 * Create a screenshot of the entire screen using the desktopCapturer module of Electron.
 *
 * @param callback {Function} callback receives as first parameter the base64 string of the image
 * @param imageFormat {String} Format of the image to generate ('image/jpeg' or 'image/png')
 **/
function fullscreenScreenshot(callback, imageFormat) {
  var _this = this;
  this.callback = callback;
  imageFormat = imageFormat || "image/jpeg";

  this.handleStream = stream => {
    // Create hidden video tag
    var video = document.createElement("video");
    video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
    // Event connected to stream
    video.onloadedmetadata = function() {
      // Set video ORIGINAL height (screenshot)
      video.style.height = this.videoHeight + "px"; // videoHeight
      video.style.width = this.videoWidth + "px"; // videoWidth

      // Create canvas
      var canvas = document.createElement("canvas");
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      var ctx = canvas.getContext("2d");
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (_this.callback) {
        // Save screenshot to base64
        _this.callback(canvas.toDataURL(imageFormat));
      } else {
        console.log("Need callback!");
      }

      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {}
    };
    video.src = URL.createObjectURL(stream);
    document.body.appendChild(video);
  };

  this.handleError = function(e) {
    console.log(e);
  };

  // Filter only screen type
  desktopCapturer.getSources({ types: ["screen"] }, (error, sources) => {
    if (error) throw error;
    // console.log(sources);
    for (let i = 0; i < sources.length; ++i) {
      console.log(sources);
      // Filter: main screen
      if (sources[i].name === "Entire screen") {
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: sources[i].id,
                minWidth: 1280,
                maxWidth: 4000,
                minHeight: 720,
                maxHeight: 4000
              }
            }
          },
          this.handleStream,
          this.handleError
        );

        return;
      }
    }
  });
}
