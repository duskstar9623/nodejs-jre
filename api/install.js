/* Node Modules */
const fs = require('fs');
const path = require('path');
const https = require('https');

/* Npm Modules */
const axios = require('axios');
const compressing = require('compressing');
const cliProgress = require('cli-progress');

/* Internal Modules */
const com = require('../common');

// Get the final source download url
function getUrl(driver, version, os) {
    let urls = JSON.parse(fs.readFileSync(path.resolve('source.json'), { encoding: 'utf-8' }));
    let baseUrl = path.join(urls.baseUrl, version, driver, com.arch, os);
    version = 'v' + version;

    return path.join(baseUrl, urls[driver][version][os]);
}

// Get compressed format
function getCompressedFormat(url) {
    if(url.indexOf('.zip') > -1) return '.zip';
    if(url.indexOf('.tar.gz') > -1) return '.tar.gz';
    return com.fail('Unsupported compressed format: ' + path.extname(url));
}

// Make sure the source folder exists and clear it before each installation
function clearDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            const curPath = path.join(dirPath, file);
            fs.rmSync(curPath, { recursive: true });
        });
    }
    
    fs.mkdirSync(dirPath, { recursive: true });
}

// Unzip
function decompression(source, format, dest) {
    if(format === '.zip') {
        return compressing.zip.uncompress(source, dest);
    }else if(format === '.tar.gz') {
        return compressing.tgz.uncompress(source, dest);
    }
}

// Currently supported versions of driver
let versions = ['8', '11', '17'];

exports.install = (driver, version, callback) => {
    let url;
    let format;
    let tarPath;
    version = version.toString();

    // Exclude unsupported architectures, platforms and non compliant parameters
    if(com.arch !== 'x64') com.fail('Unsupported architecture: ' + com.arch);
    if(driver !== 'jre' && driver !== 'jdk') com.fail('Unsupported driver: ' + driver);
    if(!versions.includes(version)) com.fail('Unsupported driver version: ' + version);
    
    switch(com.platform) {
        case 'win32':
            url = getUrl(driver, version, 'windows');
            break;
        case 'darwin':
            url = getUrl(driver, version, 'mac');
            break;
        case 'linux':
            url = getUrl(driver, version, 'linux');
            break;
        default:
            com.fail(`Unsupported platform: ${com.platform}`);
    }

    format = getCompressedFormat(url);
    tarPath = path.resolve(`driver${format}`);
    console.log("Downloading from:", url);
    callback = callback || (() => {});

    // Prepare the source folder
    driver === 'jre' ? clearDir(com.jreDir) : clearDir(com.jdkDir);

    axios({
        method: 'get',
        url: url,
        responseType: 'stream',
        httpsAgent: new https.Agent({rejectUnauthorized: false})
    }).then(res => {
        const writer = fs.createWriteStream(tarPath);

        // Define progress bar
        const totalLength = res.headers['content-length'];
        const progressBar = new cliProgress.SingleBar({
            format: 'Downloading progress [{bar}] {percentage}% | Data: {_value}/{_total} | ETA: {eta}s',
            barCompleteChar: '=',
            barIncompleteChar: '\u00A0',
            hideCursor: true,
            barsize: 80
        }, cliProgress.Presets.legacy);
        progressBar.start(parseInt(totalLength), 0);
        
        let doneValue = 0;
        res.data.on('data', (chunk) => {
            doneValue += chunk.length;
            progressBar.increment(chunk.length, {
                _value: (parseInt(doneValue) / 1024 / 1024).toFixed(2) + ' Mb',
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
        if(driver === 'jre') return decompression(tarPath, format, com.jreDir);
        return decompression(tarPath, format, com.jdkDir);
    }).then(() => {
        fs.unlink(tarPath, () => {});
        if(callback && typeof callback === 'function') callback();
    }).catch(err => {
        com.fail(`Failed to download and extract file: ${err.message}`);
    });
}
