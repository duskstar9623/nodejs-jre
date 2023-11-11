const { spawn, spawnSync } = require('child_process');

const com = require('../common');


/*------------------------------ javac ------------------------------*/
/**
 * @description Read Java class and interface definitions and compile them into bytecode and class files
 * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
 * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
 * @param {Object} options Options used by child_process.spawn, e.g. { uid: 123 }
 */
function javac(sourceFile, args = [], options = { encoding: 'utf-8' }) {
    const { cmd, params } = com.getArgs('jdk', 'javac', sourceFile, args);

    return spawn(cmd, params, options);
}
function javacSync(sourceFile, args = [], options = { encoding: 'utf-8' }) {
    const { cmd, params } = com.getArgs('jdk', 'javac', sourceFile, args);
    
    return spawnSync(cmd, params, options);
}
/*------------------------------ javac ------------------------------*/


module.exports = {
    javac, javacSync
}
