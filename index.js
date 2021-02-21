#!/usr/bin/env node

const { Command } = require('commander');
const clear = require('clear');
const compose = require('docker-compose');
const path = require('path');
const chalk = require('chalk');

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
            await compose.upAll({ cwd: path.join(__dirname), log: true });
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