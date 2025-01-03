"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jdk = exports.jre = exports.install = void 0;
const install_1 = __importDefault(require("./lib/core/install"));
exports.install = install_1.default;
const jre_1 = __importDefault(require("./lib/core/jre"));
exports.jre = jre_1.default;
const jdk_1 = __importDefault(require("./lib/core/jdk"));
exports.jdk = jdk_1.default;
