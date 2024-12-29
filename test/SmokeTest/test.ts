import { jre } from '../../index';

export default () => {
    return true;
    // return jre.javaSync('Hello', ['-cp', 'test'], ['world']).stdout === 'Hello world!';
}
