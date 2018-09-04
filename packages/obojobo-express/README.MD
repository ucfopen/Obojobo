# Obojobo 3 Server

About this project.

## Requirements

* Node 6
* Yarn
* Posgress Database
* Docker (for development)
* Nginx (for production)

## Development Setup

The scripts section of package.json will be useful to learn.

1. clone this repo into a directory
2. run `yarn` to install packages
3. run `yarn db:initdocker` to create a postgress docker container
4. run `yarn db:migrateup` to run migrations
5. run `yarn sampleDraft:seed` to insert a sample document into the database
6. run `yarn dev` to start the development express server
7. visit `http://localhost:3000`

## Developing Obojobo Document Engine

1. run `yarn devDocEngine:setup` to install a dev copy of doc engine
2. run `yarn devDocEngine:link` to replace the node_modules version with your development Doc Engine located in /devsrc/
3. run `yarn devDocEngine:start` to initialize webpack within doc engine

## Testing

`yarn test` and `yarn test:ci`

## Production Setup

1. clone this repo into a directory
2. run `yarn` to install packages
3. setup your postgress database and add the credentials to `config/db.json`
4. run `yarn db:migrateup` to run migrations
5. run `yarn sampleDraft:seed` to insert a sample document into the database
6. run `yarn assets` to compile the javascript and css assets
7. run `yarn start` to run the server on port 3000
8. Set up nginx server to pass requests to the server
7. visit `http://localhost:3000`

## Administration

## Logging with AWS Cloudwatch

* Install https://github.com/jorgebastida/awslogs on your machine
* Search for a list of log groups you can read: `awslogs groups`
* Learn about awslogs using `awslogs --help`
* Logs from the last day: `awslogs get GROUPNAME --start='1d ago'` (Replace `GROUPNAME`)
* Watch logs: `awslogs get GROUPNAME --watch`


## Installing Obojobo Modules

### Adding new ones
### Blacklisting
### Express.js
