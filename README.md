# Obojobo Next
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-17-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Obojobo Next is a modern educational content ecosystem. Obojobo documents are programmable, extend-able, and heavily fortified with data analytics.

Our focus is on making and delivering fantastic learning content to students. Obojobo is not a [Learning Management System](https://en.wikipedia.org/wiki/Learning_management_system). Rather, it's an incredibly powerful content engine for use inside your LMS.

View the [Obojobo Next Documentation](https://ucfopen.github.io/Obojobo-Docs/).

[Join UCF Open Slack Discussions](https://ucf-open-slackin.herokuapp.com/) [![Join UCF Open Slack Discussions](https://ucf-open-slackin.herokuapp.com/badge.svg)](https://ucf-open-slackin.herokuapp.com/)

## The Obojobo Mission

To keep our collective efforts aimed in the same direction, we've outlined what we want Obojobo to be:

1. UI/UX focused design that ensures a satisfying & enjoyable student experience.
2. Low barrier of entry for content creators. Creating content is as easy as writing a document in Word.
3. Research centric design. Obojobo aims to be the premiere research-enabling learning platform by providing high resolution data, partnering with researchers, and including proven research outcomes back into the platform.
4. Extraordinary practice and assessment tools that enable emerging teaching and learning models.
5. Provide innovative new capabilities in online, blended, and mixed mode courses.
6. Architecturally extensible and modular. Obojobo Next is easy to customize and extend.

## Requirements

- [Node](https://nodejs.org/) & [Yarn](https://yarnpkg.com/)
- [PosgreSQL](https://www.postgresql.org/) Database
- [Docker](https://www.docker.com/) (for development)

## Quick Heroku Deploy

We added Heroku support as an easy way to give Obojobo a **free test drive** (or scale it up for production use).

[![Deploy Obojobo to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy/)

> [Heroku](https://www.heroku.com/what) is a cloud service that lets you host web apps in the cloud without having to worry so much about the infrastructure.

## Development Setup

1. Clone this repo
2. Run `yarn install` to install dependencies
3. Run `yarn db:rebuild` to setup the database in a Docker container
4. Run `yarn dev` to start the development express server
5. Visit [https://127.0.0.1:8080](https://127.0.0.1:8080) - You should see "Welcome to Obojobo Next"

> Familiarize yourself with the **scripts** section of package.json.

### Dev Shortcuts

[https://127.0.0.1:8080/dev](https://127.0.0.1:8080/dev) has a bunch of links that'll simulate all of the LTI integrations Obojobo supports. Use these to quickly log in and test out the different launch modes.

This route is only available in development mode. In production, the only way to log in is through an LTI launch from an LMS.

### Logging in

To view the example object you need to login via an LTI launch. Instructions are available in Obojobo: [https://127.0.0.1:8080/lti](https://127.0.0.1:8080/lti)

### Create New Documents:

Once logged in, visit [https://127.0.0.1:8080/editor](https://127.0.0.1:8080/editor). Click **+ Create New Draft** to get started.

### Testing

`yarn test` or `yarn test:ci`

### Special Thanks

Support for this work was provided by the National Science Foundation Scholarships in Science, Technology, Engineering, and Mathematics (S-STEM) program under [Award No.1643835](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1643835). Any opinions, findings, conclusions and recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/maufcost"><img src="https://avatars1.githubusercontent.com/u/39862359?v=4" width="100px;" alt=""/><br /><sub><b>Mauricio Figueiredo</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=maufcost" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=maufcost" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/vutoan1245"><img src="https://avatars0.githubusercontent.com/u/23706824?v=4" width="100px;" alt=""/><br /><sub><b>Toan Vu</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=vutoan1245" title="Code">💻</a> <a href="#ideas-vutoan1245" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Avutoan1245" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=vutoan1245" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://ctcuff.github.io"><img src="https://avatars2.githubusercontent.com/u/7400747?v=4" width="100px;" alt=""/><br /><sub><b>Cameron Cuff</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=ctcuff" title="Code">💻</a> <a href="#ideas-ctcuff" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Actcuff" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=ctcuff" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/AnthonyRodriguez726"><img src="https://avatars2.githubusercontent.com/u/11856062?v=4" width="100px;" alt=""/><br /><sub><b>AnthonyRodriguez726</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=AnthonyRodriguez726" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3AAnthonyRodriguez726" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=AnthonyRodriguez726" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/rmanbaird"><img src="https://avatars0.githubusercontent.com/u/22771644?v=4" width="100px;" alt=""/><br /><sub><b>Ralph Baird</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=rmanbaird" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Armanbaird" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=rmanbaird" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/clpetersonucf"><img src="https://avatars0.githubusercontent.com/u/1268547?v=4" width="100px;" alt=""/><br /><sub><b>Corey Peterson</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=clpetersonucf" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SidTheEngineer"><img src="https://avatars0.githubusercontent.com/u/19176417?v=4" width="100px;" alt=""/><br /><sub><b>Sid</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=SidTheEngineer" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=SidTheEngineer" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://keeganberry.com"><img src="https://avatars2.githubusercontent.com/u/229935?v=4" width="100px;" alt=""/><br /><sub><b>Keegan Berry</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=keeeeeegan" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=keeeeeegan" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/adrianfish"><img src="https://avatars3.githubusercontent.com/u/134546?v=4" width="100px;" alt=""/><br /><sub><b>Adrian Fish</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=adrianfish" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/issues?q=author%3Aadrianfish" title="Bug reports">🐛</a> <a href="#ideas-adrianfish" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/FrenjaminBanklin"><img src="https://avatars1.githubusercontent.com/u/1275983?v=4" width="100px;" alt=""/><br /><sub><b>Brandon Stull</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=FrenjaminBanklin" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/issues?q=author%3AFrenjaminBanklin" title="Bug reports">🐛</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=FrenjaminBanklin" title="Tests">⚠️</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3AFrenjaminBanklin" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://blog.sheasilverman.com"><img src="https://avatars3.githubusercontent.com/u/1273237?v=4" width="100px;" alt=""/><br /><sub><b>Shea</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=ssilverm" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/samuel-belcastro"><img src="https://avatars0.githubusercontent.com/u/17661897?v=4" width="100px;" alt=""/><br /><sub><b>Samuel Belcastro</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=samuel-belcastro" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=samuel-belcastro" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/gitnix"><img src="https://avatars1.githubusercontent.com/u/5448785?v=4" width="100px;" alt=""/><br /><sub><b>Ryan Eppers</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/issues?q=author%3Agitnix" title="Bug reports">🐛</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=gitnix" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=gitnix" title="Documentation">📖</a> <a href="#ideas-gitnix" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-gitnix" title="Maintenance">🚧</a> <a href="#platform-gitnix" title="Packaging/porting to new platform">📦</a> <a href="#question-gitnix" title="Answering Questions">💬</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Agitnix" title="Reviewed Pull Requests">👀</a> <a href="#tool-gitnix" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/JonGuilbe"><img src="https://avatars2.githubusercontent.com/u/9093729?v=4" width="100px;" alt=""/><br /><sub><b>Jonathan Guilbe</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=JonGuilbe" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=JonGuilbe" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/qwertynerd97"><img src="https://avatars3.githubusercontent.com/u/36134301?v=4" width="100px;" alt=""/><br /><sub><b>Elli Howard</b></sub></a><br /><a href="#a11y-qwertynerd97" title="Accessibility">️️️️♿️</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=qwertynerd97" title="Code">💻</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=qwertynerd97" title="Documentation">📖</a> <a href="#ideas-qwertynerd97" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-qwertynerd97" title="Maintenance">🚧</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Aqwertynerd97" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=qwertynerd97" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://www.zachberry.com"><img src="https://avatars2.githubusercontent.com/u/73479?v=4" width="100px;" alt=""/><br /><sub><b>Zachary Berry</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=zachberry" title="Code">💻</a> <a href="#content-zachberry" title="Content">🖋</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=zachberry" title="Documentation">📖</a> <a href="#design-zachberry" title="Design">🎨</a> <a href="#ideas-zachberry" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-zachberry" title="Project Management">📆</a> <a href="https://github.com/ucfopen/Obojobo/pulls?q=is%3Apr+reviewed-by%3Azachberry" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://ianturgeon.com"><img src="https://avatars2.githubusercontent.com/u/73480?v=4" width="100px;" alt=""/><br /><sub><b>Ian Turgeon</b></sub></a><br /><a href="https://github.com/ucfopen/Obojobo/commits?author=iturgeon" title="Tests">⚠️</a> <a href="https://github.com/ucfopen/Obojobo/commits?author=iturgeon" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
