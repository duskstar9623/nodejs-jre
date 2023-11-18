const { spawn, spawnSync } = require('child_process');

const com = require('../common');


/*------------------------------ javac ------------------------------*/
/**
 * @description Read Java class and interface definitions and compile them into bytecode and class files
 * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
 * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
 * @param {Object} options Options used by child_process.spawn, e.g. { uid: 123 }
 */
function javac(sourceFile, args = [], options = { encoding: 'utf8' }) {
    const { cmd, params } = com.getArgs('jdk', 'javac', sourceFile, args);

    return spawn(cmd, params, options);
}
function javacSync(sourceFile, args = [], options = { encoding: 'utf8' }) {
    const { cmd, params } = com.getArgs('jdk', 'javac', sourceFile, args);
    
    return spawnSync(cmd, params, options);
}
/*------------------------------ javac ------------------------------*/


/*------------------------------ jar ------------------------------*/
/**
 * @description Create an archive for classes and resources, and to manipulate or restore individual classes or resources from an archive
 * @param {String} mode Main operation modes of jar, e.g. ['-c', '-f'], ['-tf']
 * @param {String} jarPath Path of jar file
 * @param {String | String[]} args Other operators or parameters
 * @param {Object} options Options used by child_process.spawn, e.g. { uid: 123 }
 */
function jar(mode, jarPath, args = [], options = { encoding: 'utf8' }) {
    const cmd = com.getCmdPath('jdk', 'jar');
    if(typeof args === 'string') args = [args];

    return spawn(cmd, [mode, jarPath, ...args], options);
}
function jarSync(mode, jarPath, args = [], options = { encoding: 'utf8' }) {
    const cmd = com.getCmdPath('jdk', 'jar');
    if(typeof args === 'string') args = [args];

    return spawnSync(cmd, [mode, jarPath, ...args], options);
}
/*------------------------------ jar ------------------------------*/


module.exports = {
    javac, javacSync,
    jar, jarSync
}
