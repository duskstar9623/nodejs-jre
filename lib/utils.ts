import path from 'path';
import fs from 'fs';
import os from 'os';

import color from 'ansi-colors';

// Currently supported drivers
export type Driver = 'jre' | 'jdk';
// Currently supported platform of driver
export type OS = 'windows' | 'mac' | 'linux' | 'alpine-linux';
type Com = {
    arch: string,
    platform: string,
    jreDir: string,
    jdkDir: string,
    fail: (errMsg: string) => never,
    driverVerify: (driver: Driver) => void,
    getCmdPath: (driver: Driver, cmd: string) => string,
    getParams: (driver: Driver, cmd: string, endpoint: string | string[], args: string[]) => { cmd: string, params: string[] }
}

export default {
    // Arch
    arch: os.arch(),
    // OS
    platform: os.platform(),
    // JRE folder path
    jreDir: path.join(__dirname, '..', 'jre'),
    // JDK folder path
    jdkDir: path.join(__dirname, '..', 'jdk'),
    // Error handler
    fail: function(errMsg) {
        console.error(`${color.red.bold('[nodejs-jre Error]')} ${errMsg}`);
        process.exit(1);
    },
    // Before calling the api, preliminary verification of the driver
    driverVerify: function(driver) {
        let isInstalled: boolean = false;

        if (driver === 'jre') {
            if(fs.existsSync(this.jreDir)) isInstalled = fs.readdirSync(this.jreDir).length === 0 ? false : true;
        }else {
            if(fs.existsSync(this.jdkDir)) isInstalled = fs.readdirSync(this.jdkDir).length === 0 ? false : true;
        }

        isInstalled ? null : this.fail(`Don't find the driver: ${color.yellow(driver)}, please try to install first!`);
    },
    // Get the execution path based on the specified source and command
    getCmdPath: function(driver, cmd) {
        const driverDir = driver === 'jre' ? this.jreDir : this.jdkDir;

        this.driverVerify(driver);
        const getSourceDir = (driverDir: string) => fs.readdirSync(driverDir)[0];

        switch(this.platform) {
            case "win32":
                return path.join(driverDir, getSourceDir(driverDir), path.join('bin', `${cmd}.exe`));
            case "darwin":
                return path.join(driverDir, getSourceDir(driverDir), path.join('Contents', 'Home', 'bin', `${cmd}`));
            case "linux":
                return path.join(driverDir, getSourceDir(driverDir), path.join('bin', `${cmd}`));
        }
    },
    // Universal processing function of parameters in various Java commands
    getParams: function(driver, cmd, endpoint, args) {
        const cmdPath = this.getCmdPath(driver, cmd);
        let _endpoint: string[] = [];
        if(typeof endpoint === 'string') {
            _endpoint = [endpoint];
        }else {
            _endpoint = endpoint;
        }
        const params = [...args, ..._endpoint];

        return { cmd: cmdPath, params: params };
    }
} as Com;
