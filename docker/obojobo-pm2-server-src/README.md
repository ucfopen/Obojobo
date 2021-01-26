# Obojobo Docker

We use Docker for some development tasks and for production deployment of Obojobo.


## Configuration

Obojobo follows The Twelve Factor App methodology pertaining to [environment variables for configuration](https://12factor.net/config). To take advantage of it, we'll include an example of loading configuration variables from AWS's Secrets Manager.

### ENV vars required to load secrets

* `SECRET_SOURCE` - 'aws' or 'none'  If aws, provide the following aws environment variables.  If none, be sure to provide all expected env variables to the node process (ex in docker-compose)
* `AWS_SECRETS_REGION`
* `AWS_SECRETS_KEY`


## Building a new Release

```
# create a new prerelease (creates new git tag version, npm package versions, and docker image version)
yarn lerna version --allow-branch issue/production-docker --no-push --no-commit-hooks --force-publish --yes prerelease

# build the new production ready docker container with updated application
docker-compose build app

# run a web and app server (background mode)
docker-compose up -d
```

## Test Running a 'Production Server' Locally

```bash
// create a database (can re-use the dev db)
yarn run db:rebuild

// simulate a load balancer, mainly so we can simulate the TLS (https) terminationg at the LB
// client ==(443)==> ALB ==(80)==> webserver
docker run --rm -p 443:443 -e REMOTE_URL=http://host.docker.internal:80 bostonuniversity/elb-simulator:latest

// Run the web and an app servers
// optionally, scale to multiple app servers
// docker-compose up --scale app=2 -d
docker-compose up -d

// watch the logs from the app servers
docker-compsose logs -f app
```
