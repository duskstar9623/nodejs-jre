import { expect } from "chai";
import sinon from "sinon";
import color from "ansi-colors";

import utils from '../lib/utils';
import * as smokeTest from '../test/SmokeTest/test';
import * as main from '../index';

describe("test preinstall operation", () => {
    let consoleLogStub: sinon.SinonStub;
    let failStub: sinon.SinonStub;

    beforeEach(() => {
        consoleLogStub = sinon.stub(console, 'log');
        failStub = sinon.stub(utils, 'fail');
    });

    afterEach(() => {
        consoleLogStub.restore();
        failStub.restore();
    });

    it("should log success message if smokeTest passes", () => {
        const smokeTestStub = sinon.stub(smokeTest, 'default' as never).returns(true);
        const installStub = sinon.stub(main, 'install').resolves();

        main.install('jre', 8).then(() => {
            expect(consoleLogStub.calledWith(`${color.green.bold('[nodejs-jre Info]')} Done for installing ${color.yellow('jre8')}!`)).to.be.true;
        });

        smokeTestStub.restore();
        installStub.restore();
    });

    it("should call utils.fail if smokeTest fails", () => {
        const smokeTestStub = sinon.stub(smokeTest, 'default' as never).returns(false);
        const installStub = sinon.stub(main, 'install').resolves();

        main.install('jre', 8).then(() => {
            expect(consoleLogStub.calledWith('Error occurred while downloading jre8')).to.be.true;
        });

        smokeTestStub.restore();
        installStub.restore();
    });
});
