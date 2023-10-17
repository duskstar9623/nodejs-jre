const { install } = require('./api/install');
const { java, javaSync } = require('./api/java');
const { javac,javacSync } = require('./api/javac');

module.exports = {
    install,
    java, javaSync,
    javac,javacSync
}
