[![Obojobo on npm](https://img.shields.io/npm/v/npm/next.svg)](https://pypi.python.org/pypi/canvasapi)
[![License](https://img.shields.io/pypi/l/canvasapi.svg)](https://pypi.python.org/pypi/canvasapi)
[![Documentation Status](https://readthedocs.org/projects/canvasapi/badge/?version=latest)](http://canvasapi.readthedocs.io/en/latest/?badge=latest)
[![Build Status](https://travis-ci.org/ucfopen/canvasapi.svg?branch=master)](https://travis-ci.org/ucfopen/canvasapi)
[![Coverage Status](https://coveralls.io/repos/github/ucfopen/canvasapi/badge.svg?branch=master)](https://coveralls.io/github/ucfopen/canvasapi?branch=master)
[![Join UCF Open Slack Discussions](https://ucf-open-slackin.herokuapp.com/badge.svg)](https://ucf-open-slackin.herokuapp.com/)

# Obojobo Next

Obojobo Next is a modular learning, practice and assessment platform designed to build easy to use student-focused reusable modules.

## Table of Contents

* [Documentation](#documentation)
* [Requirements](#requirements)
* [Development Quickstart](#development-quickstart)
  * [Configuring an LTI Consumer](#configuring-an-lti-consumer)
  * [Creating Test Objects](#creating-test-objects)
* [Obojobo Document Engine](#obojobo-document-engine)
* [Obojobo XML Parser](#obojobo-xml-parser)
* [Testing](#testing)
* [Production Quickstart](#production-quickstart)
* [Administration](#administration)
  * [Logging with AWS Cloudwatch](#tag)
  * [Installing Obojobo Modules](#installing-obojobo-modules)
    * [Adding new ones](#a)
  * [Blacklisting](#blacklisting)
  * [Express.js](#express.js)
* [Contact Us](#contact-us)

## Documentation

Complete documentaton for Obojobo can be found on our [wiki](https://github.com/ucfcdl/Obojobo-Next/wiki).

### Requirements

* Node 10
* Yarn
* PostgreSQL
* Docker (for development)
* Nginx (for production)

## Development Quickstart

The scripts section of `package.json` will be useful to learn.

1.  Clone this repo into a directory.
2.  Run `yarn` to install packages.
3.  Run `yarn db:initdocker` to create a Postgres container.
4.  Run `yarn db:migrateup` to run migrations.
5.  Run `yarn sampleDraft:seed` to insert a sample document into the database.
6.  Run `yarn dev` to start the development express server.
7.  Visit `https://127.0.0.1:8080`. You should see "Welcome to Obojobo Next."

### Configuring an LTI Consumer

To view the example object you need to create an LTI login. You can use an LTI testing tool for this:

1.  Visit `http://ltiapps.net/test/tc.php`
2.  Set the **Launch URL** to `https://127.0.0.1:8080/view/00000000-0000-0000-0000-000000000000`
3.  Set the **Consumer key** to `testkey`
4.  Set the **Shared secret** to `testsecret`
5.  Click **Save Data**
6.  Click **Launch TP in new window**

### Creating Test Objects

To create, edit, and delete objects:

1.  Login as above
2.  Visit `https://127.0.0.1:8080/editor` - You should not see any objects. Click **+ Create New Draft** to get started.

## Obojobo Document Engine

1.  Run `yarn devDocEngine:setup` to install a dev copy of doc engine
2.  Run `yarn devDocEngine:link` to replace the node_modules version with your development Doc Engine located in `/devsrc/`
3.  Run `yarn dev:docEngine`

## Obojobo XML Parser

1.  Run `yarn devXmlParser:setup` to install a dev copy of the parser
2.  Run `yarn devXmlParser:link` to replace the node_modules version with your development parser located in /devsrc/

## Testing

`yarn test` and `yarn test:ci`

## Production Setup

1.  Clone this repo into a directory
2.  Run `yarn` to install packages
3.  Set up your Postgres database and add the credentials to `config/db.json`
4.  Run `yarn db:migrateup` to run migrations
5.  Run `yarn sampleDraft:seed` to insert a sample document into the database
6.  Run `yarn assets` to compile the javascript and css assets
7.  Run `yarn start` to run the server on port 3000
8.  Set up nginx server to pass requests to the server
9.  Visit `https://127.0.0.1:8080/`

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
