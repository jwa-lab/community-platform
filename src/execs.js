const compose = require('docker-compose');
const path = require('path');

module.exports = {
    async tezosClient(boxName, command) {
        let res = await compose.exec(
            boxName,
            `tezos-client -E http://localhost:20000 ${ command }`,
            { 
                cwd: path.join(__dirname)
            }
        );

        if (res.err) {
            throw new Error(`Unable to execute tezos-client ${ res.err }`);
        }

        return res.out;
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
