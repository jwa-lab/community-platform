# Community Platform

Run a simplified JWA platform on your local machine:

1. Learn about the platform and see what it can do
1. Integrate your applications and games with the platform
1. Discover new usages and share them with the community

## Stack:

The community platform starts the core JWA Platform services:

1. The NATS.io message bus
1. The gRPC ingress service (airlock)

It then optionally starts additional services:

1. JWA Token service

Or your own custom services. 

The JWA Platform may integrate with a preferred blockchain or start a sandbox.