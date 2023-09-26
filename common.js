const os = require('os');
const path = require('path');
const process = require('process');

const com = {};

// arch
com.arch = os.arch();
// os
com.platform = os.platform();
// jreDir
com.jreDir = path.join(__dirname, 'jre');
// error handle
com.fail = (errMsg) => {
    console.error(errMsg);
    process.exit(1);
}


module.exports = com;
