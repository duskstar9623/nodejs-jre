const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const com = require('../common');

// Make sure the jre folder exists and is normal
function getSourceDir(jreDir) {
    return fs.readdirSync(jreDir)[0];
}

// Get the java command path
function getCommand() {
    if(!getSourceDir(com.jreDir)) com.fail('No jre source found!');

    switch(com.platform) {
        case 'win32':
            return path.resolve(com.jreDir, getSourceDir(com.jreDir), path.join('bin', 'java.exe'));
        case 'darwin':
            return path.resolve(com.jreDir, getSourceDir(com.jreDir), path.join('Contents', 'Home', 'bin', 'java'));
        case 'linux':
            return path.resolve(com.jreDir, getSourceDir(com.jreDir), path.join('bin', 'java'));
        default:
            com.fail(`Unsupported platform: ${com.platform}, no jre source found!`);
    }
}

// Get args of java command
function getArgs(classPath, className, args) {
    args = (args || []).slice();
    classPath = classPath || [];
    args.unshift(className);
    args.unshift(classPath.join(com.platform === 'win32' ? ';' : ':'));
    args.unshift('-cp');
    return args;
}


exports.spawn = (classPath, className, args, options) => {
    return child_process.spawn(getCommand(), getArgs(classPath, className, args), options);
};

exports.spawnSync = (classPath, className, args, options) => {
    return child_process.spawnSync(getCommand(), getArgs(classPath, className, args), options);
}
