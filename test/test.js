const { spawnSync } = require('../api/spawn');

exports.smokeTest = () => {
    return spawnSync([__dirname], 'Smoketest', [], {encoding: 'utf-8'})
                .stdout.trim() === 'Trigger smoke test!';
}
