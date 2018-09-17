const { desktopCapturer, ipcRenderer } = require("electron");
const { app } = require("electron").remote;
const fs = require('fs');

console.log("desktopCapturer", desktopCapturer);

function capture() {
  fullscreenScreenshot(function(base64data) {
    saveImage(base64data);
    copyToclipboard(base64data);
  }, "image/png");
}

ipcRenderer.on("capture", (data) => {
  log("on capture");
  capture();
});

function copyToclipboard(base64data) {
  const nativeImage = require("electron").nativeImage;
  const { clipboard } = require("electron");

  const image = nativeImage.createFromDataURL(base64data);
  clipboard.writeImage(image);
}

function log(message) {
  console.log(message);
}

function error(error) {
  console.error(error);
}

function getDesktop() {
  return app.getPath("desktop");
}

function getSavePath() {
  console.log("getSavePath()");
  let rawData = fs.readFileSync('settings.json');
  settings = JSON.parse(rawData);
  console.log("rawData: " + rawData);
  console.log(settings);
  if (settings.saveDir != "")
  {
    return settings.saveDir;
  }
  return getDesktop();
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
  const result = getSavePath() + path.sep + getTimeStampForFileName() + ".png";
  return result;
}

function saveImage(data) {
  var fs = require("fs");
  var base64Data;
  var binaryData;

  const fileName = getFileName();
  log("saving image to: " + fileName);

  base64Data = data.replace(/^data:image\/png;base64,/, "");
  base64Data += base64Data.replace("+", " ");
  binaryData = new Buffer(base64Data, "base64").toString("binary");

  try {
    fs.writeFileSync(fileName, binaryData, "binary");
  } catch (e) {
    error("Error saving file", e);
  }
}

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
