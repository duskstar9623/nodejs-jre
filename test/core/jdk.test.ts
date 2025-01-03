import path from 'path';
import * as child_process from "child_process";

import { expect } from 'chai';
import sinon from "sinon";
import utils from "../../lib/utils";
import jdk from '../../lib/core/jdk';

describe('test jdk module', () => {
    describe("javac", () => {
        it("should read Java class and interface definitions and compile them into bytecode and class files asynchronously", () => {
            const getParamsStub = sinon.stub(utils, "getParams").returns({ cmd: 'javac', params: ['-cp', 'path/to/jar'] });
            const child = jdk.javac('com.example.Main', ['-cp', 'path/to/jar']);
            expect(getParamsStub.calledOnceWith('jdk', 'javac', 'com.example.Main', ['-cp', 'path/to/jar'])).to.be.true;
            expect(child).to.be.an.instanceOf(child_process.ChildProcess);

            getParamsStub.restore();
        });
    });

    describe("javacSync", () => {
        it("should read Java class and interface definitions and compile them into bytecode and class files synchronously", () => {
            const getParamsStub = sinon.stub(utils, "getParams").returns({ cmd: 'javac', params: ['-cp', 'path/to/jar'] });
            const result = jdk.javacSync('com.example.Main', ['-cp', 'path/to/jar']);
            expect(getParamsStub.calledOnceWith('jdk', 'javac', 'com.example.Main', ['-cp', 'path/to/jar'])).to.be.true;
            expect(result).to.be.an('object');

            getParamsStub.restore();
        });
    });

    describe("bin", () => {
        it("should return the current bin path", () => {
            const getParamsStub = sinon.stub(utils, "getCmdPath").returns('path/to/javac');
            const binPath = jdk.bin;
            expect(getParamsStub.calledOnceWith('jdk', 'javac')).to.be.true;
            expect(binPath).to.equal(path.resolve('path/to/javac', '../'));

            getParamsStub.restore();
        });
    });
});
