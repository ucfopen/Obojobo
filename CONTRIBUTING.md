# Contributing to Obojobo

Thanks for your interest in contributing!

Below you'll find guidelines for contributing that will keep our codebase clean and happy.

## Table of Contents

* [How is the project organized?](#how-is-the-project-organized)
* [How can I contribute?](#how-can-i-contribute)
  * [Bug reports](#bug-reports)
  * [Resolving issues](#resolving-issues)
  * [Making your first contribution](#making-your-first-contribution)
    * [Setting up the environment](#setting-up-the-environment)
    * [Writing tests](#writing-tests)
      * [API Coverage Tests](#api-coverage-tests)
      * [Engine tests](#engine-tests)
    * [Running tests / coverage reports](#running-tests-coverage-reports)
    * [Making a Pull Request](#making-a-pull-request)
* [Code style guidelines](#code-style-guidelines)

## How is the project organized?

### Releases and Milestones

Obojobo is organized into a planned set of software releases. Each release is given a **dev branch** and a **project milestone**. These are identified with a number and an internal code name (we're using [minerals](https://en.wikipedia.org/wiki/List_of_minerals) as a source for our code names because rocks rock!).

To create each release we decide on a set of issues and assign them to a release milestone. We do our best to plan a few releases ahead and occasionally re-evaulate existing releases. This means we may add or move issues between releases as development continues.

Issues not attached to a milestone are simply assigned the **On Hold** milestone - these are issues that don't have a home yet but may get assigned to a new release milestone when a new release is planned.

When a release is complete the milestone is closed and the dev branch is merged into master and tagged.

### Branches, Tags, and Merging

**Master** is our production branch. It always points to the latest release (and thus is always production ready). Releases are tagged by version number using [SEMVER](http://semver.org/) with the convention `v(Version Number)`, for example `v0.1.2`.

**Dev branches** contain all the issues that make up a release. The naming convention is `dev/(Release Number)-(Code Name)`, for example `dev/4-amethyst`. These branches are merged into master when complete. Master is then tagged and the dev branch is deleted.

**Issue branches** are where all development happens. The naming convention is `issue/(Issue Number)-(Issue Description)`, for example `issue/76-remove-link-column`. These branches get merged into their associated dev branch and then are deleted.

**To summarize**:

```
  ┌───────────┐    ┌────────────────────────┐    ┌──────────────────────────────────────────────────────┐
  |  Master   | ◄─ |        Develop         | ◄─ |                        Issue                         |
  └───────────┘    └────────────────────────┘    └──────────────────────────────────────────────────────┘

    Release    ◄──  Merge                    ◄──  Merge

    Tags:           Branches:                     Branches:
    ──────────      ─────────────────────────     ───────────────────────────────────────────────────────
    v3.4.0     ◄──  dev/4-amethyst           ◄──  issue/123-fix-stuff  + issue/211-fix-more-stuff   + ...
    v3.5.0     ◄──  dev/5-snowflake-obsidian ◄──  issue/251-fix-things + issue/222-fix-other-things + ...
    v3.5.1     ◄──  dev/6-lapis-lazuli       ◄──  issue/121-add-item   + issue/99-remove-item       + ...
       .                        .                                           .
       .                        .                                           .
       .                        .                                           .
```

## How can I contribute?

### Bug Reports

Bug reports are awesome. Writing quality bug reports helps us identify issues and solve them even faster. You can submit bug reports directly to our [issue tracker](https://github.com/ucfopen/obojobo/issues).

Make sure to outline in detail the steps taken to reproduce the issue.

### Resolving issues

We welcome pull requests for bug fixes and new features! Feel free to browse our open, unassigned issues and assign yourself to them. You can also filter by labels:

* [beginner friendly](https://github.com/ucfopen/canvasapi/issues?q=sort%3Aid_desc-desc+is%3Aopen+label%3Asimple) - Easier issues to start working on; great for getting familiar with the codebase.
* @TODO: LIST MORE

Once you've found an issue you're interested in tackling, take a look at our [first contribution tutorial](#making-your-first-contribution) for information on our pull request policy.

### Making your first contribution

#### Setting up the environment

Refer to our README.md which details how to get Obojobo running.

Once you have everything setup you can go about working on your issue you normally would. We have a few requirements that you'll want to be aware of:

* Make sure to follow our [code style guidelines](#code-style-guidelines).
* You'll also need to include tests for the issue that you write - We're using [jest](https://github.com/facebook/jest) as our testing library of choice. Our goal is to maintain a 100% coverage rate so you'll need to ensure that your issue upholds that coverage.

#### Testing:

@TODO: Link to test guide.

Some useful commands to know as you develop tests:

* `yarn test` to run the tests.
* `yarn test --watch` to have jest watch your files. This is recommended so that you can get feedback as you develop your tests.
* `yarn test --coverage` (and `yarn test --watch --coverage`) to generate a coverage report. This is useful when working towards 100% coverage. You can view the generated report in a web browser by opening **coverage/lcov-report/\<project name\>/index.html**

#### Pre-commit hooks

We have a few pre-commit hooks that require that the linters and coverage guidelines are met. You can bypass this restriction with `git commit --no-verify` (not recommended) but any completed issues will need to pass these checks.

If your tests pass, your coverage is at 100% and the linters are happy then you're ready to [submit a pull request](https://github.com/ucfopen/canvasapi/pulls)!

#### Making a Pull Request

Be sure to include the issue number in the title with a pound sign in front of it (#123) so we know which issue the code is addressing. Point the branch at the current dev branch and then submit it for review. During review we may change the base as the project needs.

## Code Style Guidelines

Please refer to LINK HERE
