# Obojobo Next

Obojobo Next is a modern educational content ecosystem. Obojobo documents are programmable, extend-able, and heavily fortified with data analytics.

Our focus is on making and delivering fantastic learning content to students. Obojobo is not a [Learning Management System](https://en.wikipedia.org/wiki/Learning_management_system). Rather, it's and incredibly powerful content engine for use inside your LMS.

View the [Obojobo Next Documentation](https://ucfopen.github.io/Obojobo-Docs/).

## The Obojobo Mission

To keep our collective efforts aimed in the same direction, we've outlined what we want Obojobo to be:

1. UI/UX focused design that ensures a satisfying & enjoyable student experience.
2. Low barrier of entry for content creators. Creating content is as easy as writing a document in Word.
3. Research centric design. Obojobo aims to be the premiere research-enabling learning platform by providing high resolution data, partnering with researchers, and including proven research outcomes back into the platform.
4. Extraordinary practice and assessment tools that enable emerging teaching and learning models.
5. Provide innovative new capabilities in online, blended, and mixed mode courses.
6. Architecturally extensible and modular. Obojobo Next is easy to customize and extend.

## Requirements

* [Node](https://nodejs.org/) & [Yarn](https://yarnpkg.com/)
* [PosgreSQL](https://www.postgresql.org/) Database
* [Docker](https://www.docker.com/) (for development)

## Quick Heroku Deploy

We added Heroku support as an easy way to give Obojobo a **free test drive** (or scale it up for production use).

[![Deploy Obojobo to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy/)

> [Heroku](https://www.heroku.com/what) is a cloud service that lets you host web apps in the cloud without worring so much the infrastructure.

## Development Setup

1. Clone this repo
2. Run `yarn install` to install dependencies
3. Run `yarn setup` runs a basic setup script to build assets and setup a docker database container
4. Run `yarn dev` to start the development express server
7. Visit [https://127.0.0.1:8080](https://127.0.0.1:8080) - You should see "Welcome to Obojobo Next"

> Familiarize yourself with the **scripts** section of package.json.

### Logging in

To view the example object you need to login via an LTI launch. Instructions are available in Obojobo: [https://127.0.0.1:8080/lti](https://127.0.0.1:8080/lti)

### Create New Documents:

Once logged in, visit [https://127.0.0.1:8080/editor](https://127.0.0.1:8080/editor). Click **+ Create New Draft** to get started.

### Testing

`yarn test` or `yarn test:ci`
