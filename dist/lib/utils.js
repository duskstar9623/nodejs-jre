"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
exports.default = {
    // Arch
    arch: os_1.default.arch(),
    // OS
    platform: os_1.default.platform(),
    // JRE folder path
    jreDir: path_1.default.join(__dirname, '..', 'jre'),
    // JDK folder path
    jdkDir: path_1.default.join(__dirname, '..', 'jdk'),
    // Error handler
    fail: function (errMsg) {
        console.error(`${ansi_colors_1.default.red.bold('[nodejs-jre Error]')} ${errMsg}`);
        process.exit(1);
    },
    // Before calling the api, preliminary verification of the driver
    driverVerify: function (driver) {
        let isInstalled = false;
        if (driver === 'jre') {
            if (fs_1.default.existsSync(this.jreDir))
                isInstalled = fs_1.default.readdirSync(this.jreDir).length === 0 ? false : true;
        }
        else {
            if (fs_1.default.existsSync(this.jdkDir))
                isInstalled = fs_1.default.readdirSync(this.jdkDir).length === 0 ? false : true;
        }
        isInstalled ? null : this.fail(`Don't find the driver: ${ansi_colors_1.default.yellow(driver)}, please try to install first!`);
    },
    // Get the execution path based on the specified source and command
    getCmdPath: function (driver, cmd) {
        const driverDir = driver === 'jre' ? this.jreDir : this.jdkDir;
        this.driverVerify(driver);
        const getSourceDir = (driverDir) => fs_1.default.readdirSync(driverDir)[0];
        switch (this.platform) {
            case "win32":
                return path_1.default.join(driverDir, getSourceDir(driverDir), path_1.default.join('bin', `${cmd}.exe`));
            case "darwin":
                return path_1.default.join(driverDir, getSourceDir(driverDir), path_1.default.join('Contents', 'Home', 'bin', `${cmd}`));
            case "linux":
                return path_1.default.join(driverDir, getSourceDir(driverDir), path_1.default.join('bin', `${cmd}`));
        }
    },
    // Universal processing function of parameters in various Java commands
    getParams: function (driver, cmd, endpoint, args) {
        const cmdPath = this.getCmdPath(driver, cmd);
        let _endpoint = [];
        if (typeof endpoint === 'string') {
            _endpoint = [endpoint];
        }
        else {
            _endpoint = endpoint;
        }
        const params = [...args, ..._endpoint];
        return { cmd: cmdPath, params: params };
    }
};
