import { SpawnOptions, SpawnSyncOptions, ChildProcess, SpawnSyncReturns } from 'child_process';
declare const _default: {
    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files asynchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    javac: (sourceFile: string | string[], args?: string[], options?: SpawnOptions) => ChildProcess | void;
    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files synchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javacSync: (sourceFile: string | string[], args?: string[], options?: SpawnSyncOptions) => SpawnSyncReturns<string | Buffer>;
    readonly bin: string;
};
export default _default;
