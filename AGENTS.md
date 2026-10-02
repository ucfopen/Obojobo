# Repository guide

- This is a Yarn Classic (1.x) + Lerna workspace. Use Node `^24.0.0`, run `yarn install --frozen-lockfile` for a reproducible install, and work in the package named in its `package.json` when targeting one package.
- `packages/app` contains the Express application and document engine/parsers; `packages/obonode` contains content nodes (chunks, sections, modules, pages); `packages/util` contains shared utilities and lint/style configs. `packages/app/obojobo-express` is the server entrypoint; its webpack config builds browser assets from node manifests.
- OboNodes register runtime integrations in each package's `index.js` (`serverScripts`, `clientScripts`, config, migrations, etc.). The client build discovers these manifests across installed `obojobo-*` packages. To include every optional node in development, set `OBO_OPTIONAL_NODES=*` (the root `yarn dev` script sets this already).

## Commands

- `yarn test` runs the root Jest projects (package tests plus a Jest ESLint runner) with timezone `America/New_York`; `yarn test:ci` is the CI/coverage form.
- Run focused tests from the repo root with `yarn workspace <package-name> test --runTestsByPath <path-to-test>`. Package names are in each package's `package.json` (for example, `obojobo-chunks-question`).
- `yarn lint` runs package lint scripts via Lerna. `yarn prettier:run` formats JS/SCSS across packages; CI runs it and fails if it leaves a diff, so check the resulting changes.
- `yarn build` delegates to `obojobo-express`'s production webpack build. `yarn dev` starts the HTTPS development server at `https://127.0.0.1:8080`; `/dev` provides development LTI shortcuts.
- Local server development needs Docker and PostgreSQL: `yarn db:rebuild` recreates the `db_postgres` Docker container, runs migrations, and seeds a sample draft. It removes any existing container with that name.

## Tests and runtime details

- The test commands set `TZ=America/New_York`; keep this timezone when comparing date-sensitive results.
- Runtime configuration is assembled from JSON config files registered by installed OboNodes. Values marked `{"ENV":"NAME"}` require that environment variable; `DATABASE_URL` overrides the DB connection variables.
- Package Jest configs commonly enforce 100% global coverage, so a focused test invocation can still report a coverage-threshold failure if coverage collection is active.
