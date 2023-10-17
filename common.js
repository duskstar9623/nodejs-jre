/* Node Modules */
const os = require('os');
const path = require('path');
const process = require('process');

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

module.exports = com;
