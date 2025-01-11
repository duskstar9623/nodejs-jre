import path from 'path';
import util from 'util';
import { spawn, spawnSync, SpawnOptions, SpawnSyncOptions, ChildProcess, SpawnSyncReturns } from 'child_process';

import utils from '../utils';

export default {
    /*------------------------------ javac ------------------------------*/
    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files asynchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    javac: function(sourceFile: string | string[], args: string[] = [], options: SpawnOptions = { detached: false }): ChildProcess | void {
        const { cmd, params } = utils.getParams('jdk', 'javac', sourceFile, args);
        try {
            const child = spawn(cmd, params, options);
            child.stdout?.setEncoding("utf8");
            child.stderr?.setEncoding("utf8");
            return child;
        }
        catch(err) {
            utils.fail(util.inspect(err, { depth: 1, colors: true }));
        }
    },

    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files synchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javacSync: function(sourceFile: string | string[], args: string[] = [], options: SpawnSyncOptions = { encoding: "utf8" }): SpawnSyncReturns<string | Buffer> {
        const { cmd, params } = utils.getParams('jdk', 'javac', sourceFile, args);
        return spawnSync(cmd, params, options);
    },
    /*------------------------------ javac ------------------------------*/

    get bin() {
        return path.resolve(utils.getCmdPath('jdk', 'javac'), '../');
    }
};
