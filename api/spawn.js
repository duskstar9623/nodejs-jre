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

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

const com = require('../common');

// Make sure the jre folder exists and is normal
function isJreDir(dirPath) {
    return fs.statSync(dirPath).isDirectory()
}

// Get the java command path
function drive() {
    if(!isJreDir(com.jreDir)) com.fail('No jre source found!');

    switch(com.platform) {
        case 'win32':
            return path.resolve(com.jreDir, path.join('bin', 'java.exe'));
        case 'darwin':
            return path.resolve(com.jreDir, path.join('Contents', 'Home', 'bin', 'java'));
        case 'linux':
            return path.resolve(com.jreDir, path.join('bin', 'java'));
        default:
            com.fail(`Unsupported platform: ${com.platform}, no jre source found!`);
    }
}

// Get args of java command
function getArgs(classPath, className, args) {
    args = (args || []).slice();
    classPath = classPath || [];
    args.unshift(className);
    args.unshift(classPath.join(com.platform === 'windows' ? ';' : ':'));
    args.unshift('-cp');
    return args;
}


exports.spawn = (classPath, className, args, options) => {
    child_process.spawn(drive(), getArgs(classPath, className, args), options);
};

exports.spawnSync = (classPath, className, args, options) => {
    child_process.spawnSync(drive(), getArgs(classPath, className, args), options);
}
