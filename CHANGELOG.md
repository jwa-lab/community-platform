# Changelog

## 0.1.3

- Add option to remap ports used by the community platform
- Add command to list which ports are being used by the platform

## 0.1.1

-   Upgrade item-service to 0.0.2 which includes improved logic for recomposing item instances

## 0.1.0

-   [BREAKING] Removing `item-store` and `tokenization-service` and replace with newer `item-service`
    and `tezos-work-queue` combination which provide a simpler, integrated API and an asynchronous work queue.
    See documentation for more details: https://jwa-lab.github.io/platform-docs/

## 0.0.22

-   Upgrade authorization-service to 0.0.4

## 0.0.21

-   Upgrade authorization-service to 0.0.3

## 0.0.20

-   Upgrade airlock to 0.0.8

## 0.0.19

-   Upgrade to Granada protocol

## 0.0.18

-   Upgrade airlock to 0.0.7
-   Upgrade authorization-service to 0.0.2
-   Upgrade item-store to 0.0.8
-   Upgrade tokenization-service to 0.0.10

## 0.0.17

-   Set Tezos block_time to 2s to speed up development and testing

## 0.0.16

-   Upgrade protocol to Florence
-   Add mock authorization service and require Auth token to access Airlock API
