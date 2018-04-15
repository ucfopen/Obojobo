#! /bin/ash

# this will set the credential helper to use environment variables when git over http asks for it
git config --global credential.helper '!f() { sleep 1; printf "username=${GIT_USER}\npassword=${GIT_PASSWORD}"; }; f'

# shallow clone a specific banch into the /project directory
git clone -b $GIT_BRANCH $GIT_REPO --depth 1 /project

cd /project

# install deps
yarn install --force

yarn test --coverage
