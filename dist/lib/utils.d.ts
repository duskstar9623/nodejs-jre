export type Driver = 'jre' | 'jdk';
export type OS = 'windows' | 'mac' | 'linux' | 'alpine-linux';
type Com = {
    arch: string;
    platform: string;
    jreDir: string;
    jdkDir: string;
    fail: (errMsg: string) => never;
    driverVerify: (driver: Driver) => void;
    getCmdPath: (driver: Driver, cmd: string) => string;
    getParams: (driver: Driver, cmd: string, endpoint: string | string[], args: string[]) => {
        cmd: string;
        params: string[];
    };
};
declare const _default: Com;
export default _default;
