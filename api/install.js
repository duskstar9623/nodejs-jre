/* MIT License
 *
 * Copyright (c) 2023 Duskstar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ProgressBar = require('progress');
const axios = require('axios');
const archiver = require('archiver');

const com = require('../common');

// Get the final jre download url
function getUrl(os) {
    let url = JSON.parse(fs.readFileSync(path.resolve('url.json'), {encoding: 'utf-8'}));
    return url.baseUrl + url[os];
}

// Get compressed format
function getCompressedFormat(url) {
    if(url.indexOf('.zip') > -1) return '.zip';
    if(url.indexOf('.tar') > -1) return '.tar';
    return path.extname(url);
}

exports.install = (callback) => {
    let url;
    let format;
    let tarPath;

    // Exclude unsupported architectures and platforms
    if(com.arch !== 'x64') com.fail('Unsupported architecture: ' + com.arch);
    switch(com.platform) {
        case 'win32':
            url = getUrl('windows');
            break;
        case 'darwin':
            url = getUrl('mac');
            break;
        case 'linux':
            url = getUrl('linux');
            break;
        default:
            com.fail(`Unsupported platform: ${com.platform}`);
    }

    format = getCompressedFormat(url);
    tarPath = path.resolve(__dirname, `../jre/jre${format}`);
    console.log("Downloading from:", url);
    callback = callback || (() => {});

    if(fs.rm) {
        fs.rm(com.jreDir, {recursive: true}, () => {});
    }else {
        fs.rmdir(com.jreDir, {recursive: true}, () => {});
    }

    axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(res => {
        fs.mkdirSync(com.jreDir, { recursive: true });    // Make sure the directory exists
        const writer = fs.createWriteStream(tarPath);

        // Progress bar
        let len = parseInt(res.headers['content-length'], 10);
        let bar = new ProgressBar('Downloading and preparing JRE [:bar] :rate/bps :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 80,
            total: len
        });
        res.data.on('data', (chunk) => {
            bar.tick(chunk.length);
        });

        res.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }).then(() => {
        // Unzip the file to the jre directory
        const reader = fs.createReadStream(tarPath).pipe(archiver(
            format === '.zip' ? 'zip' : 'tar',
            {
                gzip: format === '.zip' ? false : true,
                zlib: { level: 9 }
            }
        ));

        // Wait for the decompression to complete
        return new Promise((resolve, reject) => {
            reader.on('finish', resolve);
            reader.on('error', reject);
        });
    })
}
