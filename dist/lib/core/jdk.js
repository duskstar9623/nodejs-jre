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
    /*------------------------------ javac ------------------------------*/
    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files asynchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnOptions} options Options used by child_process.spawn, e.g. { uid: 123 }
     */
    javac: function (sourceFile, args = [], options = { detached: false }) {
        const { cmd, params } = utils_1.default.getParams('jdk', 'javac', sourceFile, args);
        try {
            const child = (0, child_process_1.spawn)(cmd, params, options);
            child.stdout?.setEncoding("utf8");
            child.stderr?.setEncoding("utf8");
            return child;
        }
        catch (err) {
            utils_1.default.fail(util_1.default.inspect(err, { depth: 1, colors: true }));
        }
    },
    /**
     * @description Read Java class and interface definitions and compile them into bytecode and class files synchronously
     * @param {String | String[]} sourceFile Source file to compile, e.g. ['/home/test/hello.java', '/home/test/world.java']
     * @param {String[]} args Command-line options used by javac, e.g. ['-verbose', '-d /home/class']
     * @param {SpawnSyncOptions} options Options used by child_process.spawnSync, e.g. { uid: 123 }
     */
    javacSync: function (sourceFile, args = [], options = { encoding: "utf8" }) {
        const { cmd, params } = utils_1.default.getParams('jdk', 'javac', sourceFile, args);
        return (0, child_process_1.spawnSync)(cmd, params, options);
    },
    /*------------------------------ javac ------------------------------*/
    get bin() {
        return path_1.default.resolve(utils_1.default.getCmdPath('jdk', 'javac'), '../');
    }
};
