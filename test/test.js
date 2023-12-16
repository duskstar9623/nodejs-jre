const path = require('path');
const { jre } = require('../index');

module.exports = () => {
    return jre.javaSync('Hello', ['-cp', 'test'], ['world']).stdout === 'Hello world!';
}
