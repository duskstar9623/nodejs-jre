import path from 'path';
import * as child_process from "child_process";

import { expect } from 'chai';
import sinon from "sinon";
import utils from "../../lib/utils";
import jre from '../../lib/core/jre';

describe('test jre module', () => {
    describe("java", () => {
        it("should launch a Java application asynchronously", () => {
            const getParamsStub = sinon.stub(utils, "getParams").returns({ cmd: 'java', params: ['-cp', 'path/to/jar'] });
            const child = jre.java('com.example.Main', ['-cp', 'path/to/jar'], ['arg1', 'arg2']);
            expect(getParamsStub.calledOnceWith('jre', 'java', 'com.example.Main', ['-cp', 'path/to/jar'])).to.be.true;
            expect(child).to.be.an.instanceOf(child_process.ChildProcess);

            getParamsStub.restore();
        });
    });

    describe("javaSync", () => {
        it("should launch a Java application synchronously", () => {
            const getParamsStub = sinon.stub(utils, "getParams").returns({ cmd: 'java', params: ['-cp', 'path/to/jar'] });
            const result = jre.javaSync('com.example.Main', ['-cp', 'path/to/jar'], ['arg1', 'arg2']);
            expect(getParamsStub.calledOnceWith('jre', 'java', 'com.example.Main', ['-cp', 'path/to/jar'])).to.be.true;
            expect(result).to.be.an('object');

            getParamsStub.restore();
        });
    });

    describe("bin", () => {
        it("should return the current bin path", () => {
            const getParamsStub = sinon.stub(utils, "getCmdPath").returns('path/to/java');
            const binPath = jre.bin;
            expect(getParamsStub.calledOnceWith('jre', 'java')).to.be.true;
            expect(binPath).to.equal(path.resolve('path/to/java', '../'));

            getParamsStub.restore();
        });
    });
});
