const { spawn, spawnSync } = require('child_process');

const com = require('../common');


/*------------------------------ java ------------------------------*/
/**
 * @description Launch a Java application
 * @param {String} source Jar file, source file or class name to launch, e.g. com.xxx.xxx
 * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
 * @param {String[]} execArgs Arguments to the main class
 * @param {Object} options Options used by child_process.spawn, e.g. { uid: 123 }
 */
function java(source, args = [], execArgs = [], options = { encoding: 'utf8' }) {
    const { cmd, params } = com.getArgs('jre', 'java', source, args);
    
    return spawn(cmd, [...params, ...execArgs], options);
}
function javaSync(source, args = [], execArgs = [], options = { encoding: 'utf8' }) {
    const { cmd, params } = com.getArgs('jre', 'java', source, args);

    return spawnSync(cmd, [...params, ...execArgs], options);
}
/*------------------------------ java ------------------------------*/


module.exports = {
    java, javaSync
}
