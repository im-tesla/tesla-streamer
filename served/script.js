const socket = io();

socket.on('hello', (data) => {
    console.log('Received welcoming message from server:', data);
    socket.emit('requestStats');
    setInterval(() => {
        document.getElementById('waiting-for-connection').style.display = 'none';
        document.getElementById('main-content').style.display = 'inherit';
    }, 1000); //I like my loading screen so bad, and I want to see it for a while :D
});

socket.on('stats', (data) => {
    console.log('Received stats from server:', data);
    document.getElementById('backpack-data-temp').innerText = data.cpuTemperature;
    document.getElementById('backpack-data-cpu-usage').innerText = data.cpuUsage;
    document.getElementById('backpack-data-ram-usage').innerText = data.ramUsage;
    document.getElementById('backpack-data-battery-percentage').innerText = data.batteryPercentage;
});

setInterval(() => {
    socket.emit('requestStats');
}, 5000);