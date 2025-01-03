import path from 'path';
import fs, { Dirent } from 'fs';
import os from "os";

import { expect } from 'chai';
import color from 'ansi-colors';
import sinon from 'sinon';
import utils from '../lib/utils';

describe('test utils module', () => {
    describe("arch", () => {
        it("should return the current arch", () => {
            expect(utils.arch).to.equal(os.arch());
        });
    });

    describe("platform", () => {
        it("should return the current platform", () => {
            expect(utils.platform).to.equal(os.platform());
        });
    });

    describe("jreDir", () => {
        it("should return the correct JRE directory path", () => {
            expect(utils.jreDir).to.equal(path.join(__dirname, '..', "jre"));
        })
    });

    describe("jdkDir", () => {
        it("should return the correct JDK directory path", () => {
            expect(utils.jdkDir).to.equal(path.join(__dirname, '..', "jdk"));
        })
    });

    describe("fail", () => {
        it("should throw an error and exit the process", () => {
            const exitStub = sinon.stub(process, "exit");
            const consoleStub = sinon.stub(console, "error");
            
            try {
                utils.fail('Test error');
            }
            catch(e) {
                // Do nothing
            }
            expect(consoleStub.calledWith(`${color.red.bold('[nodejs-jre Error]')} Test error`)).to.be.true;
            expect(exitStub.calledWith(1)).to.be.true;

            consoleStub.restore();
            exitStub.restore();
        })
    });

    describe("driverVerify", () => {
        it("should call fail when JRE driver is not installed", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
            const failStub = sinon.stub(utils, 'fail');
            
            utils.driverVerify('jre');
            expect(failStub.calledWith(`Don't find the driver: ${color.yellow('jre')}, please try to install first!`)).to.be.true;

            fsExistsSyncStub.restore();
            failStub.restore();
        });

        it("should call fail when JDK driver is not installed", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(false);
            const failStub = sinon.stub(utils, 'fail');
            
            utils.driverVerify('jdk');
            expect(failStub.calledWith(`Don't find the driver: ${color.yellow('jdk')}, please try to install first!`)).to.be.true;

            fsExistsSyncStub.restore();
            failStub.restore();
        });

        it("should not call fail when the driver is installed", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
            const fsReaddirSyncStub = sinon.stub(fs, 'readdirSync').returns(['jdk-11' as unknown as Dirent]);
            const failStub = sinon.stub(utils, 'fail');

            utils.driverVerify('jdk');
            expect(failStub.notCalled).to.be.true;

            fsExistsSyncStub.restore();
            fsReaddirSyncStub.restore();
            failStub.restore();
        });
    });

    describe("getCmdPath", () => {
        it("should return the correct cmd path for windows", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
            const fsReaddirSyncStub = sinon.stub(fs, 'readdirSync').returns(['jre-11' as unknown as Dirent]);
            const platformStub = sinon.stub(os, 'platform').returns('win32');
            const cmdPath = utils.getCmdPath('jre', 'java');

            expect(cmdPath).to.equal(path.join(__dirname, '..', 'jre', 'jre-11', 'bin', 'java.exe'));

            fsExistsSyncStub.restore();
            fsReaddirSyncStub.restore();
            platformStub.restore();
        });

        it("should return the correct cmd path for darwin", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
            const fsReaddirSyncStub = sinon.stub(fs, 'readdirSync').returns([path.join('jre-11', 'Contents', 'Home') as unknown as Dirent]);
            const platformStub = sinon.stub(utils, 'platform').returns('darwin');
            const cmdPath = utils.getCmdPath('jre', 'java');

            expect(cmdPath).to.include('Contents');
            expect(cmdPath).to.include('Home');

            fsExistsSyncStub.restore();
            fsReaddirSyncStub.restore();
            platformStub.restore();
        });

        it("should return the correct cmd path for linux", () => {
            const fsExistsSyncStub = sinon.stub(fs, 'existsSync').returns(true);
            const fsReaddirSyncStub = sinon.stub(fs, 'readdirSync').returns(['jre-11' as unknown as Dirent]);
            const platformStub = sinon.stub(utils, 'platform').returns('linux');
            const cmdPath = utils.getCmdPath('jre', 'java');

            expect(cmdPath).to.include("java");

            fsExistsSyncStub.restore();
            fsReaddirSyncStub.restore();
            platformStub.restore();
        });
    });

    describe("getParams", () => {
        it("should return the correct command path and parameters", () => {
            const getCmdPathStub = sinon.stub(utils, 'getCmdPath').returns('/path/to/java');
            const cmd = 'java';
            const endpoint = 'endpoint';
            const args = ['arg1', 'arg2'];
            const result = utils.getParams('jdk', cmd, endpoint, args);
            expect(result.cmd).to.equal('/path/to/java');
            expect(result.params).to.deep.equal(['arg1', 'arg2', 'endpoint']);
            getCmdPathStub.restore();
        });

        it("should handle multiple endpoints correctly", () => {
            const getCmdPathStub = sinon.stub(utils, 'getCmdPath').returns('/path/to/java');
            const cmd = 'java';
            const endpoints = ['endpoint1', 'endpoint2'];
            const args = ['arg1', 'arg2'];
            const result = utils.getParams('jdk', cmd, endpoints, args);
            expect(result.cmd).to.equal('/path/to/java');
            expect(result.params).to.deep.equal(['arg1', 'arg2', 'endpoint1', 'endpoint2']);
            getCmdPathStub.restore();
        });
    });
});
