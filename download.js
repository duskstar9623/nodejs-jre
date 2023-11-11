const color = require('ansi-colors');

require('.').install('jre', 8, () => { console.log(`[${color.green.bold('Nodejs-jre Info')}] Done for installing jre8!`) });
