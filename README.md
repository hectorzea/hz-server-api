## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ docker compose -f ./docker-compose.dev.yml up
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run Headless Pup

1- Abrir consola y pegar

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')

1.1 - Obtener link 'ws://...//' del output del comando y pegar en wsChromeEndpointUrl

2- ir a linkedin y loguearse, cerrar ventana.

3- ejecutar api

## Run hz-server-api / mongodb database with Docker Compose
URL generada por el proyecto dockerizado
```http://localhost:3001/api/tasks ```
