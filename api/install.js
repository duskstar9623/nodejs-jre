/* Node Modules */
const fs = require('fs');
const path = require('path');
const https = require('https');

/* Npm Modules */
const ProgressBar = require('progress');
const axios = require('axios');
const compressing = require('compressing');

/* Internal Modules */
const com = require('../common');
const { smokeTest } = require('../test/test');

// Get the final jre download url
function getUrl(os) {
    let url = JSON.parse(fs.readFileSync(path.resolve('url.json'), {encoding: 'utf-8'}));
    return url.baseUrl + url[os];
}

// Get compressed format
function getCompressedFormat(url) {
    if(url.indexOf('.zip') > -1) return '.zip';
    if(url.indexOf('.tar.gz') > -1) return '.tar.gz';
    return path.extname(url);
}

// Unzip
function decompression(source, format, dest) {
    if(format === '.zip') {
        return compressing.zip.uncompress(source, dest);
    }else if(format === '.tar.gz') {
        return compressing.tgz.uncompress(source, dest);
    }
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
        let bar = new ProgressBar('Downloading and preparing JRE [:bar] :percent   Remainder::etas', {
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
        return decompression(tarPath, format, com.jreDir);
    }).then(() => {
        fs.unlinkSync(tarPath);

        // Smoke test
        if(smokeTest()) {
            console.log('Smoke test passed!');
            callback();
        }else {
            callback('Smoke test failed!')
        }
    }).catch(err => {
        com.fail(`Failed to download and extract file: ${err.message}`);
    });
}
