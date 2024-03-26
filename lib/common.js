const os = require('os');
const path = require('path');
const process = require('process');
const fs = require('fs');

const color = require('ansi-colors');

const com = {};

// arch
com.arch = os.arch();
// os
com.platform = os.platform();
// jreDir, jdkDir
com.jreDir = path.join(__dirname, '../jre');
com.jdkDir = path.join(__dirname, '../jdk');

// Error handle
com.fail = (errMsg) => {
    console.error(`${color.red.bold('[nodejs-jre Error]')} ${errMsg}`);
    process.exit(1);
}
// Before calling the api, preliminary verification of the driver
com.driverVerify = (driver) => {
    let isInstalled;

    if(driver === 'jre') {
        if(fs.existsSync(com.jreDir)) {
            isInstalled = fs.readdirSync(com.jreDir).length === 0 ? false : true;
        }else {
            isInstalled = false;
        }
    }else {
        if(fs.existsSync(com.jdkDir)) {
            isInstalled = fs.readdirSync(com.jdkDir).length === 0 ? false : true;
        }else {
            isInstalled = false;
        }
    }

    isInstalled ? null : com.fail(`Don't find the driver: ${color.yellow(driver)}, please try to install first!`);
}
// Get the execution path based on the specified source and command
com.getCmdPath = (driver, cmd) => {
    let driverDir;
    driverDir = driver === 'jre'? com.jreDir : com.jdkDir;

    com.driverVerify(driver);
    let getSourceDir = (driverDir) => fs.readdirSync(driverDir)[0];

    switch(com.platform) {
        case 'win32':
            return path.resolve(driverDir, getSourceDir(driverDir), path.join('bin', `${cmd}.exe`));
        case 'darwin':
            return path.resolve(driverDir, getSourceDir(driverDir), path.join('Contents', 'Home', 'bin', `${cmd}`));
        case 'linux':
            return path.resolve(driverDir, getSourceDir(driverDir), path.join('bin', `${cmd}`));
    }
}
// Universal processing function of parameters in various Java commands
com.getArgs = (driver, cmd, endpoint, args) => {
    cmd = com.getCmdPath(driver, cmd);
    if(typeof endpoint === 'string') endpoint = [endpoint];
    const params = [...args, ...endpoint];

    return { cmd: cmd, params: params };
}


module.exports = com;
