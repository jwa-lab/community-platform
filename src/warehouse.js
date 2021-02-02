const { execNpm } = require('./npm');

module.exports = {
    getContractKT1(networkId) {
        let contract;

        try {
            contract = require('../build/contracts/Warehouse.json') ;
        } catch (err) {
            console.error('Unable to retrieve Warehouse.json contract. Make sure npx truffle migrate has been executed.')
        }

        return contract.networks[networkId].address;
    },

    deployContract() {
        return execNpm("deploy");
    }
}