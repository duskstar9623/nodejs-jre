"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const child_process_1 = require("child_process");
const utils_1 = __importDefault(require("../utils"));
exports.default = {
    /*------------------------------ java ------------------------------*/
    /**
     * @description Launch a Java application asynchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    java: function (sourceName, args = [], execArgs = [], options = { detached: false }) {
        const { cmd, params } = utils_1.default.getParams('jre', 'java', sourceName, args);
        try {
            const child = (0, child_process_1.spawn)(cmd, [...params, ...execArgs], options);
            child.stdout?.setEncoding("utf8");
            child.stderr?.setEncoding("utf8");
            return child;
        }
        catch (err) {
            utils_1.default.fail(util_1.default.inspect(err, { depth: 1, colors: true }));
        }
    },
    /**
     * @description Launch a Java application synchronously
     * @param {String} sourceName Jar file, source file or class name to launch, e.g. com.xxx.xxx
     * @param {String[]} args Command-line options used by java, e.g. ['-cp', './jar/xxx.jar;', './jar/yyy.jar']
     * @param {String[]} execArgs Arguments to the main class
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javaSync: function (sourceName, args = [], execArgs = [], options = { encoding: "utf8" }) {
        const { cmd, params } = utils_1.default.getParams('jre', 'java', sourceName, args);
        return (0, child_process_1.spawnSync)(cmd, [...params, ...execArgs], options);
    },
    /*------------------------------ java ------------------------------*/
    get bin() {
        return path_1.default.resolve(utils_1.default.getCmdPath('jre', 'java'), '../');
    }
};
