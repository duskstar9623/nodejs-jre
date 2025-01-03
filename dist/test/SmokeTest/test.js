"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const index_1 = require("../../index");
exports.default = () => {
    return index_1.jre.javaSync('Hello', ['-cp', path_1.default.join(__dirname, '../../../test/SmokeTest')], ['world']).stdout === 'Hello world!';
};
