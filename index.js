const { install } = require('./api/install');
const { java, javaSync } = require('./api/java');
const { javac,javacSync } = require('./api/javac');

const jre = {
    java, javaSync
};

const jdk = {
    javac,javacSync
}

module.exports = {
    install, jre, jdk
}
