"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const utils_1 = __importDefault(require("./utils"));
const test_1 = __importDefault(require("../test/SmokeTest/test"));
const index_1 = require("../index");
(0, index_1.install)('jre', 8).then(() => {
    if ((0, test_1.default)()) {
        console.log(`${ansi_colors_1.default.green.bold('[nodejs-jre Info]')} Done for installing ${ansi_colors_1.default.yellow('jre8')}!`);
    }
    else {
        utils_1.default.fail('Error occurred while downloading jre8');
    }
});
