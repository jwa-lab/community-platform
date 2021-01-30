const compose = require('docker-compose');
const path = require('path');

module.exports = {
    tezosClient(boxName, command) {
        return compose.exec(
            boxName,
            `tezos-client -E http://localhost:20000 ${ command }`,
            { 
                cwd: path.join(__dirname)
            }
        );
    },

    runBox(boxName, command) {
        return compose.exec(
            boxName,
            `${ boxName } ${ command }`,
            { 
                cwd: path.join(__dirname)
            }
        );
    }
}
