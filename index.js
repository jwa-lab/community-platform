#!/usr/bin/env node

const { Command } = require('commander');
const clear = require('clear');
const compose = require('docker-compose');
const path = require('path');
const chalk = require('chalk');
const { spawn } = require('child_process');

const package = require('./package.json');

clear();

const { BOX_NAME = 'carthagebox' } = process.env;

const program = new Command();

program
    .description(`${ chalk.grey('JWA') }${ chalk.bold('_LAB')} - v${ package.version }
Run a JWA Community platform (jwalab) on your local machine!
`)
.version(package.version)
    .name('jwalab a.k.a JWA Community platform')
    .usage('[global options] command');

program
    .command('start')
    .description('start the jwalab environment')
    .action(async () => {
        try {
            await compose.upMany([
                'airlock',
                'carthagebox',
                'elasticsearch',
                'item-store',
                'kibana',
                'nats',
                'tzindex',
                'tzstats'
            ], { cwd: path.join(__dirname), log: true });

            const networkId = stripQuotes(await tezosClient(BOX_NAME, 'rpc get /chains/main/chain_id'));
            console.log(`jwalab started, Tezos Network Id is ${ networkId }`)

            await deployContract()

            const warehouseKT1 = getContractKT1(networkId);

            console.log(`Contract Warehouse deployed here: ${ warehouseKT1 }`);

            process.env.WAREHOUSE_CONTRACT_ADDRESS=warehouseKT1;

            await compose.upOne('tokenization-service', { cwd: path.join(__dirname), log: true });
            
        } catch (err) {
            console.error('something went wrong:', err)
        }
    });

program
    .command('stop')
    .description('stop the jwalab environment')
    .action(() => {
        compose.down({ 
            cwd: path.join(__dirname),
            log: true,
            commandOptions: ['--remove-orphans']
        })
            .then(
                () => { console.log('jwalab stopped')},
                err => { console.log('something went wrong:', err.message)}
            );
    });

program
    .command('kill')
    .description('kill the jwalab environment')
    .action(() => {
        compose.kill({ 
            cwd: path.join(__dirname),
            log: true,
            commandOptions: ['--remove-orphans']
        })
            .then(
                () => { console.log('jwalab killed')},
                err => { console.log('something went wrong:', err.message)}
            );
    });

program
    .command('tezos-client')
    .description('run a command in the tezos-client')
    .action(() => {
        tezosClient(BOX_NAME, program.args.slice(1).join(' ')).then(
            (res) => { console.log(res.out) },
            (res) => { console.log(`\nThis is not an error with jwalab but most likely with the tezos-client. ${ res.out }`)}
        );
    }).addHelpText('after', `
    Examples:
      $ jwalab tezos-client -- --help
      $ jwalab tezos-client -- list known contracts
`);

program
    .command(BOX_NAME)
    .description(`run a command in ${ BOX_NAME }`)
    .action(() => {
        runBox(BOX_NAME, program.args.slice(1).join(' ')).then(
            () => { },
            () => { console.log(`\nThis is not an error with jwalab but most likely with ${BOX_NAME}`)}
        );
    }).addHelpText('after', `
    Examples:
      $ jwalab ${ BOX_NAME } -- --help
      $ jwalab ${ BOX_NAME } -- info
`);

program.parse(process.argv);

function stripQuotes(string) {
    return string.slice(1, -2);
}

async function tezosClient(boxName, command) {
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
}

function runBox(boxName, command) {
    return compose.exec(
        boxName,
        `${ boxName } ${ command }`,
        { 
            cwd: path.join(__dirname)
        }
    );
}

function getContractKT1(networkId) {
    let contract;

    try {
        contract = require('./build/contracts/Warehouse.json') ;
    } catch (err) {
        console.error('Unable to retrieve Warehouse.json contract. Make sure npx truffle migrate has been executed.')
    }

    return contract.networks[networkId].address;
}

function deployContract() {
    return new Promise((resolve, reject) => {
        const npx = spawn('npx', ['truffle', 'migrate', '--force'], { cwd: __dirname });
        
        npx.stdout.on('data', data => {
            console.log(String(data));
        });

        npx.stderr.on('data', data => {
            console.error(String(data));
        });

        npx.on('error', data => {
            console.error(String(data));
            reject();
        });

        npx.on('close', code => {
            console.log(String(code));
            resolve();
        });
    });
}