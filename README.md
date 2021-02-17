# Community Platform

Run a simplified JWA platform on your local machine:

1. Learn about the platform and see what it can do
1. Integrate your applications and games with the platform
1. Discover new usages and share them with the community

## Stack

The community platform starts the core JWA Platform services:

1. The NATS.io message bus
1. The gRPC ingress service (airlock)
1. A Tezos sandbox
1. Observability tools

It then starts additional services:

1. JWA Tokenization service
1. JWA Item store
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

## Update the contracts

For now, the contracts are copy/pasted from their initial repositories.
To udpate them, simply copy/paste the following:

- LIGO contracts in ./contracts
- Migration scripts in ./migrations

When the platform starts, it runs a truffle migration on them automatically