import { SpawnOptions, SpawnSyncOptions, ChildProcess, SpawnSyncReturns } from 'child_process';
declare const _default: {
    /**
     * @description Launch a Java application asynchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    java: (sourceName: string, args?: string[], execArgs?: string[], options?: SpawnOptions) => ChildProcess;
    /**
     * @description Launch a Java application synchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javaSync: (sourceName: string, args?: string[], execArgs?: string[], options?: SpawnSyncOptions) => SpawnSyncReturns<string | Buffer>;
    readonly bin: string;
};
export default _default;
