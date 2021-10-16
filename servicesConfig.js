module.exports = {
    tzbox: {
        name: "Tezos Sandbox",
        overrideVar: "JWALAB_TZBOX_PORT",
        port: 20000
    },
    nats: {
        name: "NATS",
        overrideVar: "JWALAB_NATS_PORT",
        port: 4222
    },
    "authorization-service": {
        name: "Auth Service",
        overrideVar: "JWALAB_AUTH_SERVICE_PORT",
        port: 8999
    },
    airlock: {
        name: "Airlock",
        overrideVar: "JWALAB_AIRLOCK_PORT",
        port: 8000
    },
    tzindex: {
        name: "TzIndex",
        overrideVar: "JWALAB_TZINDEX_PORT",
        port: 8002
    },
    tzstats: {
        name: "TzStats",
        overrideVar: "JWALAB_TZSTATS_PORT",
        port: 8001
    },
    postgres: {
        name: "PostgreSQL",
        overrideVar: "JWALAB_POSTGRES_PORT",
        port: 5432
    },
    "swagger-ui": {
        name: "Swagger UI",
        overrideVar: "JWALAB_SWAGGER_PORT",
        port: 8080
    }
};
