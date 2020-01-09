[![Coverage Status](https://coveralls.io/repos/leomonteiro92/cashback-api/badge.svg?branch=master)](https://coveralls.io/r/leomonteiro92/cashback-api?branch=master)

# Node.JS API

API to manage users

## Requirements

- Node.js >= 8.11.0 (Preferable the LTS Version Erbium)
- MongoDB (Latest stable)
- Optional: Docker and Docker Compose: Stable versions

## Running Superheroes API

### 1) Ensure databases are running

For convenience, you can run the databases using docker containers. Ensure that the host ports are available:

```bash
docker-compose up -d
```

To stop the databases:

```bash
docker-compose stop
```

### 2) Install dependencies

After cloning the repository, move to the main directory and run

```git
npm install
```

In order to `bcrypt` be installed properly, make sure you have installed the SSL libraries in the host machine that will run the application. If you are using a Ubuntu based host, just run:

```bash
apt-get install libssl-dev
```

### 3) Create the environment

Create a file `.env` and set the following variables:

| Variable   | Description                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| DB_URL     | Database hostname. Ex.: `127.0.0.1`                                               |
| JWT_SECRET | Secret to sign the jwt's                                                          |
| PORT       | The default port which the application server listens. Default: `5000`            |
| NODE_ENV   | Environment to run the application. Accepts `development`, `test` or `production` |

After the enviroment is set, run:

```bash
source .env
```

### 4) Run the tests

To run tests, use:

```bash
npm test
```

### 5) Start the application

```bash
npm start
```
