#! /bin/ash

# shallow clone a specific banch into the /project directory
git clone -b $GIT_BRANCH $GIT_REPO --depth 1 /project

cd /project

# install deps
yarn install --force

yarn test:ci
