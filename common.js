/* Node Modules */
const os = require('os');
const path = require('path');
const process = require('process');
const fs = require('fs');

const com = {};

// arch
com.arch = os.arch();

// os
com.platform = os.platform();

// jreDir, jdkDir
com.jreDir = path.join(__dirname, 'jre');
com.jdkDir = path.join(__dirname, 'jdk');

// Error handle
com.fail = (errMsg) => {
    console.error(`[nodejs-jre error] ${errMsg}`);
    process.exit(1);
}

// Before calling the api, preliminary verification of the driver
com.driverVerify = (driver) => {
    let isInstalled = true;

    if(driver === 'jre') {
        if(fs.existsSync(com.jreDir)) {
            isInstalled = fs.readdirSync(com.jreDir).length === 0 ? false : null;
        }else {
            isInstalled = false;
        }
    }else {
        if(fs.existsSync(com.jdkDir)) {
            isInstalled = fs.readdirSync(com.jdkDir).length === 0 ? false : null;
        }else {
            isInstalled = false;
        }
    }

    isInstalled ? null : com.fail(`Don't find the driver: ${driver}, please try to install first!!!`);
}

module.exports = com;
