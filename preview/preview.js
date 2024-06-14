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

//will it going to be safe for disk, constant writing and deleting files?
//i'm not sure, but I will try to find a better solution for this.