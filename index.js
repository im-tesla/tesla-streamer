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

        //heres the magic

        setTimeout(() => {
            socket.emit('streamInfo', 'success');
        }, 3000);
    });

    socket.emit('hello', 'hi im server');
});

server.listen(port, () => {
    console.log(`IRL streamer is running on port ${port}`);
});