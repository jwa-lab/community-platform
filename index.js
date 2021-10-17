#!/usr/bin/env node

const { Command } = require("commander");
const clear = require("clear");
const compose = require("docker-compose");
const path = require("path");
const chalk = require("chalk");
const { spawn } = require("child_process");

const servicesConfig = require("./servicesConfig.js");
const package = require("./package.json");

clear();

ensurePorts(servicesConfig);

const { BOX_NAME = "granabox", JWALAB_TZBOX_PORT } = process.env;

const program = new Command();

program
    .description(
        `${chalk.grey("JWA")}${chalk.bold("_LAB")} - v${package.version}
Run a JWA Community platform (jwalab) on your local machine!
`
    )
    .version(package.version)
    .name("jwalab a.k.a JWA Community platform")
    .usage("[global options] command");

program
    .command("start")
    .description("start the jwalab environment")
    .action(async () => {
        try {
            await compose.upAll({ cwd: path.join(__dirname), log: true });
        } catch (err) {
            console.error("something went wrong:", err);
        }
    });

program
    .command("stop")
    .description("stop the jwalab environment")
    .action(() => {
        compose
            .down({
                cwd: path.join(__dirname),
                log: true,
                commandOptions: ["--remove-orphans"]
            })
            .then(
                () => {
                    console.log("jwalab stopped");
                },
                (err) => {
                    console.log("something went wrong:", err.message);
                }
            );
    });

program
    .command("kill")
    .description("kill the jwalab environment")
    .action(() => {
        compose
            .kill({
                cwd: path.join(__dirname),
                log: true,
                commandOptions: ["--remove-orphans"]
            })
            .then(
                () => {
                    console.log("jwalab killed");
                },
                (err) => {
                    console.log("something went wrong:", err.message);
                }
            );
    });

program
    .command("pull")
    .description(`download the latest versions of the platform's services`)
    .action(() => {
        compose
            .pullAll({
                cwd: path.join(__dirname),
                log: true
            })
            .then(
                () => {
                    console.log("jwalab updated");
                },
                (err) => {
                    console.log("something went wrong:", err.message);
                }
            );
    });

program
    .command("tezos-client")
    .description("run a command in the tezos-client")
    .action(() => {
        tezosClient(BOX_NAME, program.args.slice(1).join(" ")).then(
            (res) => {
                console.log(res.out);
            },
            (res) => {
                console.log(
                    `\nThis is not an error with jwalab but most likely with the tezos-client. ${res.out}`
                );
            }
        );
    })
    .addHelpText(
        "after",
        `
    Examples:
      $ jwalab tezos-client -- --help
      $ jwalab tezos-client -- list known contracts
`
    );

program
    .command(BOX_NAME)
    .description(`run a command in ${BOX_NAME}`)
    .action(() => {
        runBox(BOX_NAME, program.args.slice(1).join(" ")).then(
            () => {},
            () => {
                console.log(
                    `\nThis is not an error with jwalab but most likely with ${BOX_NAME}`
                );
            }
        );
    })
    .addHelpText(
        "after",
        `
    Examples:
      $ jwalab ${BOX_NAME} -- --help
      $ jwalab ${BOX_NAME} -- info
`
    );

program
    .command("list-services")
    .description("list all running services and the port they expose")
    .action(async () => {
        const servicePorts = [];

        await Promise.allSettled(
            Object.entries(servicesConfig).map(async ([name, { port }]) => {
                const servicePort = {
                    "Service Name": servicesConfig[name].name,
                    "Mapped Port": "Not running",
                    "ENV VAR for override": servicesConfig[name].overrideVar
                };

                try {
                    const { out } = await compose.port(name, port);

                    servicePort["Mapped Port"] = Number(out.split(":")[1]);
                } catch (err) {}

                servicePorts.push(servicePort);
            })
        );

        console.table(
            servicePorts.sort((serviceA, serviceB) =>
                serviceA["Service Name"] > serviceB["Service Name"] ? 1 : -1
            )
        );
    });

program
    .command("logs")
    .description("view platform logs")
    .action(async () => {
        const log = spawn("docker", ["compose", "logs", "-f"], {
            cwd: path.join(__dirname),
            maxBuffer: 1_000_000
        });

        log.stdout.on("data", (data) => console.log(String(data)));
        log.stdout.on("error", (err) => console.error("error: ", err));
    });

program.parse(process.argv);

async function tezosClient(boxName, command) {
    let res = await compose.exec(
        boxName,
        `tezos-client -E http://localhost:${JWALAB_TZBOX_PORT} ${command}`,
        {
            cwd: path.join(__dirname)
        }
    );

    if (res.err) {
        throw new Error(`Unable to execute tezos-client ${res.err}`);
    }

    return res.out;
}

function runBox(boxName, command) {
    return compose.exec(boxName, `${boxName} ${command}`, {
        cwd: path.join(__dirname)
    });
}

function ensurePorts(services) {
    Object.values(services).forEach(({ overrideVar, port }) => {
        if (!process.env[overrideVar]) {
            process.env[overrideVar] = port;
        }
    });
}
