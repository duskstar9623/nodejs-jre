import path from 'path';
import util from 'util';
import { spawn, spawnSync, SpawnOptions, SpawnSyncOptions, ChildProcess, SpawnSyncReturns } from 'child_process';

import utils from '../utils';

export default {
    /*------------------------------ java ------------------------------*/
    /**
     * @description Launch a Java application asynchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    java: function(sourceName: string, args: string[] = [], execArgs: string[] = [], options: SpawnOptions = { detached: false }): ChildProcess | void {
        const { cmd, params } = utils.getParams('jre', 'java', sourceName, args);
        try {
            const child = spawn(cmd, [...params, ...execArgs], options);
            child.stdout?.setEncoding("utf8");
            child.stderr?.setEncoding("utf8");
            return child;
        }
        catch(err) {
            utils.fail(util.inspect(err, { depth: 1, colors: true }));
        }
    },

    /**
     * @description Launch a Java application synchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javaSync: function(sourceName: string, args: string[] = [], execArgs: string[] = [], options: SpawnSyncOptions = { encoding: "utf8" }): SpawnSyncReturns<string | Buffer> {
        const { cmd, params } = utils.getParams('jre', 'java', sourceName, args);
        return spawnSync(cmd, [...params, ...execArgs], options);
    },
    /*------------------------------ java ------------------------------*/

    get bin() {
        return path.resolve(utils.getCmdPath('jre', 'java'), '../');
    }
};
