# Community Platform

Run a simplified JWA platform on your local machine:

1. Learn about the platform and see what it can do
1. Integrate your applications and games with the platform
1. Discover new usages and share them with the community

## Stack

The community platform starts the core JWA Platform services:

1. The NATS.io message bus
1. The REST ingress service (airlock)
1. A mock authorization service for airlock
1. A Tezos sandbox
1. Observability tools

It then starts additional services:

1. JWA Item Service
1. Or run your own services on top of it

## Getting started

To get started, all you need is a recent version of Docker, including Docker compose.

```
npm install -g @jwalab/community-platform

jwalab --help
```

Start the platform:

```
jwalab start
```

## Tutorial

An online tutorial is available here: https://jwa-lab.github.io/platform-docs/

## Options

### Changing ports

It's possible that you have other applications running on ports that the Community Platform may want to use.

Here's the list of ports that will be mapped to your local machine:

| Service       | Default Port | Description                                                                          | Override env variable    |
| ------------- | ------------ | ------------------------------------------------------------------------------------ | ------------------------ |
| Tezos Sandbox | 20000        | The local Tezos Node. You may make RPC calls to this URL                             | JWALAB_TZBOX_PORT        |
| NATS          | 4222         | NATS is the message bus. Port 4222 is the main port for pub/sub                      | JWALAB_NATS_PORT         |
| Auth Service  | 8999         | The Mock Auth Service that returns Bearer Tokens to authenticate with Airlock        | JWALAB_AUTH_SERVICE_PORT |
| Airlock       | 8000         | The Platform's main port of entry, you will make all of the APIs calls via this port | JWALAB_AIRLOCK_PORT      |
| TzStats       | 8001         | A useful tool for collecting stats on the Tezos Sandbox                              | JWALAB_TZSTATS_PORT      |
| TzIndex       | 8002         | A useful tool for exploring the Tezos Sandbox                                        | JWALAB_TZINDEX_PORT      |
| PostgreSQL    | 5432         | The platform's DB for storing items, useful for debugging                            | JWALAB_POSTGRES_PORT     |
| Swagger UI    | 3000         | A Swagger UI for navigating the platform's documentation                             | JWALAB_SWAGGER_PORT      |

If you'd like to remap any of those ports, simply set the port value to the corresponding environment variable override.

For instance, setting Airlock to a new port:

```
JWALAB_AIRLOCK_PORT=9000 jwalab start
```

### .env

The platform currently doesn't support reading environment variables from a .env file, however, feel free to create one and store it where you want. You can load it an run the platform using this syntax:

```sh
export $(cat .env) && jwalab start
```

### Currently used ports

There's a useful command to list all the ports being used by the platform, along with the environment variable to remap the port.

```sh
$ jwalab list-services

┌─────────┬─────────────────┬───────────────┬────────────────────────────┐
│ (index) │  Service Name   │  Mapped Port  │    ENV VAR for override    │
├─────────┼─────────────────┼───────────────┼────────────────────────────┤
│    0    │    'Airlock'    │ 'Not running' │   'JWALAB_AIRLOCK_PORT'    │
│    1    │ 'Auth Service'  │     8999      │ 'JWALAB_AUTH_SERVICE_PORT' │
│    2    │     'NATS'      │     4222      │     'JWALAB_NATS_PORT'     │
│    3    │  'PostgreSQL'   │     5432      │   'JWALAB_POSTGRES_PORT'   │
│    4    │  'Swagger UI'   │     8080      │   'JWALAB_SWAGGER_PORT'    │
│    5    │ 'Tezos Sandbox' │     20000     │    'JWALAB_TZBOX_PORT'     │
│    6    │    'TzIndex'    │     8002      │   'JWALAB_TZINDEX_PORT'    │
│    7    │    'TzStats'    │     8001      │   'JWALAB_TZSTATS_PORT'    │
└─────────┴─────────────────┴───────────────┴────────────────────────────┘
```

## Commands

```
JWA_LAB - v0.1
Run a JWA Community platform (jwalab) on your local machine!


Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  start           start the jwalab environment
  stop            stop the jwalab environment
  kill            kill the jwalab environment
  pull            download the latest versions of the platform's services
  tezos-client    run a command in the tezos-client
  granabox        run a command in granabox
  list-services   list all running services and the port they expose
  logs            view platform logs
  help [command]  display help for command
```
