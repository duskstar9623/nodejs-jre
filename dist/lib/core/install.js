"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const util_1 = __importDefault(require("util"));
const web_streams_polyfill_1 = require("web-streams-polyfill");
if (typeof globalThis.ReadableStream === 'undefined') {
    globalThis.ReadableStream = web_streams_polyfill_1.ReadableStream;
}
const axios_1 = __importDefault(require("axios"));
const compressing_1 = __importDefault(require("compressing"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const cheerio = __importStar(require("cheerio"));
const utils_1 = __importDefault(require("../utils"));
// Base URL
const baseUrl = 'https://mirrors.tuna.tsinghua.edu.cn/Adoptium';
// Currently supported versions of driver
const versions = [8, 11, 17, 18, 19, 20, 21];
// Get the url of fetching resource name
function buildUrl(driver, version, os) {
    return path_1.default.join(baseUrl, version, driver, utils_1.default.arch, os);
}
// Fetching resource name
async function getResourceName(url) {
    console.log(`${ansi_colors_1.default.green.bold('[nodejs-jre Info]')} Fetching the resource name ... ... ...`);
    try {
        const html = await (0, axios_1.default)(url, {
            httpsAgent: new https_1.default.Agent({ keepAlive: true, rejectUnauthorized: false }),
            proxy: false
        });
        const $ = cheerio.load(html.data);
        return $('#list tbody tr .link a').last().text();
    }
    catch (err) {
        utils_1.default.fail(util_1.default.inspect(err, { depth: 1, colors: true }));
    }
    return '';
}
// Get compressed format
function getCompressedFormat(url) {
    if (url.indexOf('.zip') > -1)
        return '.zip';
    if (url.indexOf('.tar.gz') > -1)
        return '.tar.gz';
    return utils_1.default.fail('Unsupported compressed format: ' + ansi_colors_1.default.yellow(path_1.default.extname(url)));
}
// Make sure the source folder 
function clearDir(dirPath) {
    if (fs_1.default.existsSync(dirPath)) {
        const files = fs_1.default.readdirSync(dirPath);
        files.forEach((file) => {
            const curPath = path_1.default.join(dirPath, file);
            fs_1.default.rmSync(curPath, { recursive: true, force: true });
        });
    }
    fs_1.default.mkdirSync(dirPath, { recursive: true });
}
// Unzip process
function decompression(source, format, dest) {
    if (format === '.zip') {
        return compressing_1.default.zip.uncompress(source, dest);
    }
    else if (format === '.tar.gz') {
        return compressing_1.default.tgz.uncompress(source, dest);
    }
}
/**
 * @description Install the driver of specified version
 * @param {Driver} driver Only support 'jre' or 'jdk'
 * @param {typeof versions[number]} version Version of JRE or JDK to be installed
 * @param {OS} os Operating system compatible with the JRE or JDK
 */
async function default_1(driver, version, os) {
    let url = '';
    let format;
    let tarPath;
    const _driver = driver.toLowerCase();
    const _version = version.toString();
    // Exclude unsupported architectures, platforms and non compliant parameters
    if (utils_1.default.arch !== 'x64')
        utils_1.default.fail('Unsupported architecture: ' + ansi_colors_1.default.yellow(utils_1.default.arch));
    if (_driver !== 'jre' && _driver !== 'jdk')
        utils_1.default.fail('Unsupported driver: ' + ansi_colors_1.default.yellow(driver));
    if (!versions.includes(version))
        utils_1.default.fail('Unsupported driver version: ' + ansi_colors_1.default.yellow(_version));
    if (os) {
        url = buildUrl(_driver, _version, os);
    }
    else {
        switch (utils_1.default.platform) {
            case 'win32':
                url = buildUrl(_driver, _version, 'windows');
                break;
            case 'darwin':
                url = buildUrl(driver, _version, 'mac');
                break;
            case 'linux':
                url = buildUrl(driver, _version, 'linux');
                break;
            default:
                utils_1.default.fail(`Unsupported platform: ${ansi_colors_1.default.yellow(utils_1.default.platform)}`);
        }
    }
    const resource = await getResourceName(url);
    url = path_1.default.join(url, resource);
    format = getCompressedFormat(url);
    tarPath = path_1.default.resolve(__dirname, `../../driver${format}`);
    if (fs_1.default.existsSync(tarPath)) {
        fs_1.default.rmSync(tarPath, { recursive: true, force: true });
    }
    ;
    console.log("Downloading from:", ansi_colors_1.default.blue.underline(url));
    // Prepare the source folder
    _driver === 'jre' ? clearDir(utils_1.default.jreDir) : clearDir(utils_1.default.jdkDir);
    return (0, axios_1.default)({
        method: 'get',
        url: url,
        responseType: 'stream',
        httpsAgent: new https_1.default.Agent({ keepAlive: true, rejectUnauthorized: false }),
        proxy: false
    }).then(res => {
        const writer = fs_1.default.createWriteStream(tarPath);
        // Define progress bar
        const totalLength = res.headers['content-length'];
        const progressBar = new cli_progress_1.default.SingleBar({
            format: `${ansi_colors_1.default.magenta.italic('Downloading progress')} [${ansi_colors_1.default.cyan('{bar}')}] ${ansi_colors_1.default.red('{percentage}%')} | ${ansi_colors_1.default.yellow('Data')}: {_value}/{_total}`,
            barCompleteChar: '=',
            barIncompleteChar: '\u00A0',
            hideCursor: true,
            barsize: 80
        }, cli_progress_1.default.Presets.legacy);
        progressBar.start(parseInt(totalLength), 0);
        let doneValue = 0;
        res.data.on('data', (chunk) => {
            doneValue += chunk.length;
            progressBar.increment(chunk.length, {
                _value: (parseInt(doneValue.toString()) / 1024 / 1024).toFixed(2) + ' Mb',
                _total: (parseInt(totalLength) / 1024 / 1024).toFixed(2) + ' Mb'
            });
        });
        res.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                progressBar.stop();
                resolve();
            });
            writer.on('error', reject);
        });
    }).then(() => {
        // Unzip the file to the driver directory
        if (_driver === 'jre')
            return decompression(tarPath, format, utils_1.default.jreDir);
        return decompression(tarPath, format, utils_1.default.jdkDir);
    }).then(() => {
        fs_1.default.unlink(tarPath, () => { });
    }).catch(err => {
        utils_1.default.fail(`Failed to download and extract file: ${ansi_colors_1.default.yellow(util_1.default.inspect(err, { depth: 1 }))}`);
    });
}
