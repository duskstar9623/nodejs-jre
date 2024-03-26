const color = require('ansi-colors');
const com = require('./common');
const smokeTest = require('../test/test');

require('../index').install('jre', 8, () => {
    if(smokeTest()) {
        console.log(`${color.green.bold('[nodejs-jre Info]')} Done for installing ${color.yellow('jre8')}!`);
    }else {
        com.fail('Error occurred while downloading jre8');
    }
});
