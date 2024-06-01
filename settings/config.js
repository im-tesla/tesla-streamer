const fs = require('fs');
const path = require('path');

function loadConfig() {
    const configPath = path.join(__dirname, 'config.json');
    if (!fs.existsSync(configPath)) {
        console.log('Config file not found, creating new one...');
        fs.writeFileSync(configPath, JSON.stringify({}));
        return {};
    }

    const config = fs.readFileSync(configPath);
    return JSON.parse(config);
}

function saveConfig(newConfig) {
    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(newConfig));
}

function getFrameRate() {
    const config = loadConfig();
    return config.fps || 30;
}

function getResolution() {
    const config = loadConfig();
    return config.resolution || 0;
}

function getBitrate() {
    const config = loadConfig();
    return config.bitrate || 1000;
}

function getReceiverIP() {
    const config = loadConfig();
    return config.receiverIP || '0.0.0.0';
}

function getResolutionY() {
    const resolution = getResolution();
    switch (resolution) {
        case 0:
            return 720;
        case 1:
            return 1080;
        case 2:
            return 1440;
        case 3:
            return 2160;
    }
}

function getResolutionX() {
    const resolution = getResolution();
    switch (resolution) {
        case 0:
            return 1280;
        case 1:
            return 1920;
        case 2:
            return 2560;
        case 3:
            return 3840;
    }
}

module.exports = {
    loadConfig,
    saveConfig,
    getFrameRate,
    getResolution,
    getBitrate,
    getReceiverIP,
    getResolutionX,
    getResolutionY
}