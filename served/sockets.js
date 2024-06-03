const socket = io();

var isStreaming = false;

function onSettingsSave() {
    const resolution = document.getElementById('resolution').selectedIndex;
    const fps = document.getElementById('fps').selectedIndex;
    const bitrate = document.getElementById('bitrate').value;
    const receiverIP = document.getElementById('receiverIP').value;

    const data = {
        resolution,
        fps,
        bitrate,
        receiverIP
    }

    socket.emit('settings', data);
    showAlert('Settings saved successfully!', 'success');
}

function startStream() {
    const receiverIP = document.getElementById('receiverIP').value;
    showAlert('Establishing connection with ' + receiverIP + '...', 'info');
    socket.emit('startStream');
}

function restartSystem() {
    socket.emit('restartSystem');
    showAlert('Restarting system...', 'error');
}

function streamStarted() {
    isStreaming = true;
    document.getElementById('startStreamButton').classList.remove('btn-neutral');
    document.getElementById('startStreamButton').classList.add('btn-primary');
    document.getElementById('startStreamButton').setAttribute('onclick', 'stopStreamAreYouSure.showModal()');
    document.getElementById('startStreamButton').innerText = 'Stop streaming to relay';
}

function stopStream() {
    socket.emit('stopStream');
    isStreaming = false;
    document.getElementById('startStreamButton').classList.remove('btn-primary');
    document.getElementById('startStreamButton').classList.add('btn-neutral');
    document.getElementById('startStreamButton').setAttribute('onclick', 'startStream()');
    document.getElementById('startStreamButton').innerText = 'Start streaming to relay';
    document.getElementById('streamPreview').src = 'placeholder-1280-720.jpg';
    showAlert('Stream stopped successfully!', 'error');
}

socket.on('hello', (data) => {
    console.log('Received welcoming message from server:', data);
    socket.emit('requestStats');
    socket.emit('requestSettings')
    setInterval(() => {
        document.getElementById('waiting-for-connection').style.display = 'none';
        document.getElementById('main-content').style.display = 'inherit';
    }, 1000); //I like my loading screen so bad, and I want to see it for a while :D
});

socket.on('stats', (data) => {
    //console.log('Received stats from server:', data);
    document.getElementById('backpack-data-temp').innerText = data.cpuTemperature;
    document.getElementById('backpack-data-cpu-usage').innerText = data.cpuUsage;
    document.getElementById('backpack-data-ram-usage').innerText = data.ramUsage;
    document.getElementById('backpack-data-battery-percentage').innerText = data.batteryPercentage;
});

socket.on('loadSettings', (data) => {
    console.log(data);
    document.getElementById('resolution').selectedIndex = data.resolution;
    document.getElementById('fps').selectedIndex = data.fps;
    document.getElementById('bitrate').value = data.bitrate;
    document.getElementById('receiverIP').value = data.receiverIP;
})

socket.on('streamInfo', (data) => {
   switch (data) {
         case 'success': {
              streamStarted();
              showAlert('Stream started successfully!', 'success');
              break;
         }
         case 'error': {
              showAlert('Stream could not be started!', 'error');
              break;
         }
   }
});

socket.on('preview', (data) => {
    document.getElementById('streamPreview').src = 'data:image/jpeg;base64,' + data;
})
setInterval(() => {
    socket.emit('requestStats');
}, 3000);

setInterval(() => {
    if (isStreaming) {
        socket.emit('getPreview');
    }
}, 2000)