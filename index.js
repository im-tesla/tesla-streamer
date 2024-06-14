const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const port = 3000;
const server = http.createServer(app);
const io = socketIo(server);
const { loadConfig, saveConfig } = require('./settings/config.js');
const { cpuTemperature, batteryPercentage, cpuUsage, ramUsage } = require('./info/stats.js')
const { exec } = require('child_process');
const { getLatestFrame } = require('./preview/preview.js');
const {getResolutionX, getResolutionY, getCameraIndex, getFrameRate, getBitrate, getReceiverIP} = require("./settings/config");

app.use(express.static(path.join(__dirname, 'served')));

io.on('connection', (socket) => {
    console.log('[*] New frontend connection!');

    socket.on('saveSettings', (data) => {
        console.log('Settings JSON:', data);
    });

    socket.on('requestStats' , async () => {
        //console.log('[?] Frontend requested stats, sending data...');
        const stats = {
            cpuTemperature: await cpuTemperature(),
            batteryPercentage: await batteryPercentage(),
            cpuUsage: await cpuUsage(),
            ramUsage: await ramUsage()
        };
        socket.emit('stats', stats);
    });

    socket.on('requestSettings', async() => {
        socket.emit('loadSettings', loadConfig());
    })

    socket.on('settings', async (data) => {
        console.log("[+] Received new settings ", data);
        saveConfig(data);
    })

    socket.on('startStream', () => {
        console.log('[+] Starting stream...');
        const resolutionX = getResolutionX();
        const resolutionY = getResolutionY();
        const cameraIndex = getCameraIndex();
        const streamFPS = getFrameRate();
        const bitrate = getBitrate();
        const receiverIP = getReceiverIP();

        //base command
        const streamProcess = exec('gst-launch-1.0 avfvideosrc ! video/x-raw,framerate=30/1 ! tee name=t t. ! queue ! videoconvert ! videorate ! "video/x-raw,framerate=1/2" ! jpegenc ! multifilesink location="preview/frames/frame%05d.jpg" t. ! queue ! fakesink');

        streamProcess.stdout.on('data', (data) => {
            console.log(data);
            if (data.includes('Pipeline is live')) {
                setTimeout(() => {
                    socket.emit('streamInfo', 'success');
                },3000); // 3 seconds to prepare and make sure the stream is running
            }
        });

        streamProcess.stderr.on('data', (data) => {
            console.error(data);
        });
    });

    socket.on('stopStream', () => {
        console.log('[+] Stopping stream...');
        const stopStreamProcess = exec('killall gst-launch-1.0');
        stopStreamProcess.stdout.on('data', (data) => {
            console.log(data);
            if (data.includes('No matching processes')) {
                socket.emit('streamInfo', 'success');
            }
        });
        stopStreamProcess.stderr.on('data', (data) => {
            console.error(data);
        });
    });

    socket.on('getPreview', () => {
        const frame = getLatestFrame();
        socket.emit('preview', frame);
    });

    socket.emit('hello', 'hi im server');
});

server.listen(port, () => {
    console.log(`IRL streamer is running on port ${port}`);
});