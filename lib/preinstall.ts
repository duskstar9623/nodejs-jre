import color from 'ansi-colors';
import utils from './utils';
import smokeTest from '../test/SmokeTest/test';
import  { install } from '../index';

install('jre', 8).then(() => {
    if(smokeTest()) {
        console.log(`${color.green.bold('[nodejs-jre Info]')} Done for installing ${color.yellow('jre8')}!`);
    }else {
        utils.fail('Error occurred while downloading jre8');
    }
});
