import path from 'path';
import fs from "fs";
import https from 'https';

import axios from 'axios';
import compressing from 'compressing';
import cliProgress from 'cli-progress';
import color from 'ansi-colors';
import * as cheerio from 'cheerio';

import utils, { Driver, OS } from '../utils';

// Base URL
const baseUrl = 'https://mirrors.tuna.tsinghua.edu.cn/Adoptium';
// Currently supported versions of driver
const versions = [8, 11, 17, 18, 19, 20, 21] as const;

// Get the url of fetching resource name
function buildUrl(driver: string, version: string, os: string): string {
    return path.join(baseUrl, version, driver, utils.arch, os);
}
// Fetching resource name
async function getResourceName(url: string): Promise<string> {
    console.log(`${color.green.bold('[nodejs-jre Info]')} Fetching the resource name ... ... ...`);
    try {
        const html = await axios(url, {
            httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
            proxy: false
        });
        const $ = cheerio.load(html.data);
        return $('#list tbody tr .link a').last().text();
    }
    catch(err: any) {
        utils.fail(err.message);
    }
    return '';
}
// Get compressed format
function getCompressedFormat(url: string): string | never {
    if(url.indexOf('.zip') > -1) return '.zip';
    if(url.indexOf('.tar.gz') > -1) return '.tar.gz';
    return utils.fail('Unsupported compressed format: ' + color.yellow(path.extname(url)));
}
// Make sure the source folder 
function clearDir(dirPath: string): void {
    if(fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            const curPath = path.join(dirPath, file);
            fs.rmSync(curPath, { recursive: true, force: true });
        })
    }

    fs.mkdirSync(dirPath, { recursive: true });
}
// Unzip process
function decompression(source: string, format: string, dest: string): Promise<void> | void {
    if(format === '.zip') {
        return compressing.zip.uncompress(source, dest);
    }else if(format === '.tar.gz') {
        return compressing.tgz.uncompress(source, dest);
    }
}

/**
 * @description Install the driver of specified version
 * @param {Driver} driver Only support 'jre' or 'jdk'
 * @param {typeof versions[number]} version Version of JRE or JDK to be installed
 * @param {OS} os Operating system compatible with the JRE or JDK
 */
export default async function(driver: Driver, version: typeof versions[number], os?: OS): Promise<void> {
    let url: string = '';
    let format: string;
    let tarPath: string;
    const _driver = driver.toLowerCase();
    const _version = version.toString();
    
    // Exclude unsupported architectures, platforms and non compliant parameters
    if(utils.arch !== 'x64') utils.fail('Unsupported architecture: ' + color.yellow(utils.arch));
    if(_driver !== 'jre' && _driver !== 'jdk') utils.fail('Unsupported driver: ' + color.yellow(driver));
    if(!versions.includes(version)) utils.fail('Unsupported driver version: ' + color.yellow(_version));

    if(os) {
        url = buildUrl(_driver, _version, os);
    }else {
        switch(utils.platform) {
            case 'win32':
                url = buildUrl(_driver, _version, 'windows');
                break;
            case 'darwin':
                url = buildUrl(driver, _version,'mac');
                break;
            case 'linux':
                url = buildUrl(driver, _version,'linux');
                break;
            default:
                utils.fail(`Unsupported platform: ${color.yellow(utils.platform)}`);
        }
    }

    const resource = await getResourceName(url);
    url = path.join(url, resource);

    format = getCompressedFormat(url);
    tarPath = path.resolve(__dirname, `../../driver${format}`);
    if(fs.existsSync(tarPath)) { fs.rmSync(tarPath, { recursive: true, force: true }) };
    console.log("Downloading from:", color.blue.underline(url));

    // Prepare the source folder
    _driver === 'jre' ? clearDir(utils.jreDir) : clearDir(utils.jdkDir);

    return axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        httpsAgent: new https.Agent({ keepAlive: true,rejectUnauthorized: false }),
        proxy: false
    }).then(res => {
        const writer = fs.createWriteStream(tarPath);

        // Define progress bar
        const totalLength = res.headers['content-length'];
        const progressBar = new cliProgress.SingleBar({
            format: `${color.magenta.italic('Downloading progress')} [${color.cyan('{bar}')}] ${color.red('{percentage}%')} | ${color.yellow('Data')}: {_value}/{_total}`,
            barCompleteChar: '=',
            barIncompleteChar: '\u00A0',
            hideCursor: true,
            barsize: 80
        }, cliProgress.Presets.legacy);
        progressBar.start(parseInt(totalLength), 0);
        
        let doneValue = 0;
        res.data.on('data', (chunk: Buffer) => {
            doneValue += chunk.length;
            progressBar.increment(chunk.length, {
                _value: (parseInt(doneValue.toString()) / 1024 / 1024).toFixed(2) + ' Mb',
                _total: (parseInt(totalLength) / 1024 / 1024).toFixed(2) + ' Mb'
            });
        });
        res.data.pipe(writer);
      
        return new Promise<void>((resolve, reject) => {
            writer.on('finish', () => {
                progressBar.stop();
                resolve();
            });
            writer.on('error', reject);
        });
    }).then(() => {
        // Unzip the file to the driver directory
        if(_driver === 'jre') return decompression(tarPath, format, utils.jreDir);
        return decompression(tarPath, format, utils.jdkDir);
    }).then(() => {
        fs.unlink(tarPath, () => {});
    }).catch(err => {
        utils.fail(`Failed to download and extract file: ${color.yellow(err.message)}`);
    });
}
