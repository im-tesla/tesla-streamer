const util= require('util');
const exec = util.promisify(require('child_process').exec);
var os= require('os');

async function cpuTemperature() {
    const { stdout } = await exec(__dirname + '/osx-cpu-temp');
    return stdout.replace('\n', '');
}

async function cpuUsage() {
    const { stdout } = await exec('top -l 1 -n 0 | grep "CPU usage"');
    const usage = stdout.split(' ');
    const cpuUsage = {
        user: usage[2].replace('%', ''),
        sys: usage[4].replace('%', ''),
        idle: usage[6].replace('%', '')
    }

    return parseInt(100 - cpuUsage.idle) + "%";
}

async function ramUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const percentage = (used / total) * 100;
    return parseInt(percentage) + "%";
}

async function batteryPercentage() {
    const { stdout } = await exec('pmset -g batt');
    return stdout.split('\t')[1].split(';')[0];
}

module.exports = {
    cpuTemperature,
    cpuUsage,
    ramUsage,
    batteryPercentage
}