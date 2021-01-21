# TypeScript-Express-REST-Starter
Kick-starter to your REST application.

## Setup
    npm i

## How to run?
    Development: npm run serve
    Build: npm run build
    Production: npm start

## Project Structure
    .
    ├── LICENSE
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── resources
    │   ├── development.json
    │   └── production.json
    ├── src
    │   ├── App.ts
    │   ├── controllers
    │   │   ├── index.ts
    │   │   ├── person.controller.ts
    │   │   └── root.controller.ts
    │   ├── index.ts
    │   ├── interfaces
    │   │   ├── config.interface.ts
    │   │   ├── index.ts
    │   │   └── models
    │   │       ├── index.ts
    │   │       └── person.interface.ts
    │   ├── models
    │   │   ├── index.ts
    │   │   └── person.model.ts
    │   └── routes
    │       ├── index.ts
    │       ├── person.route.ts
    │       └── root.route.ts
    └── tsconfig.json

## Deploy
    npm i -g pm2
    pm2 --name <app_name_here> start npm -- start --watch-delay <seconds_here>

## Check Application Status
    pm2 ps
