import path from 'path';
import { jre } from '../../index';

export default () => {
    return jre.javaSync('Hello', ['-cp', path.join(__dirname, '../../../test/SmokeTest')], ['world']).stdout === 'Hello world!';
}
