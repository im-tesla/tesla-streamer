//in ./preview/frames we got the images
//the image are took each 2 seconds
//frame00000.jpg
//frame00001.jpg
//frame00002.jpg
//etc..
//each 3 seconds we should read the latest image, send it to the client and remove all of them
//to save space
//we should create a function that returns base64 of latest preview image

const fs = require('fs');
const path = require('path');

function getLatestFrame() {
    const framesPath = path.join(__dirname, 'frames');
    const frames = fs.readdirSync(framesPath);
    const latestFrame = frames[frames.length - 1];
    const framePath = path.join(framesPath, latestFrame);
    const frame = fs.readFileSync(framePath);
    removeFrames();
    return frame.toString('base64');
}

function removeFrames() {
    const framesPath = path.join(__dirname, 'frames');
    const frames = fs.readdirSync(framesPath);
    frames.forEach((frame) => {
        fs.unlinkSync(path.join(framesPath, frame));
    });
}

module.exports = {
    getLatestFrame
}
