FROM node:10-alpine
RUN apk add --no-cache \
  tzdata \
  build-base \
  git \
  python \
  yarn

CMD mkdir /project

# ADD bin/docker_clone_and_test.sh /bin/docker_clone_and_test.sh

# set some default env vars
ENV GIT_BRANCH=master
ENV GIT_REPO=https://github.com/ucfcdl/Obojobo-Next.git

# this will set the credential helper to use environment variables when git over http asks for it
RUN git config --global credential.helper '!f() { sleep 1; printf "username=${GIT_USER}\npassword=${GIT_PASSWORD}"; }; f'

# Run tests completely within the container
# docker build -t docengine:latest .
# docker run -i -e GIT_USER -e GIT_PASSWORD -e GIT_BRANCH docengine:latest /bin/docker_clone_and_test.sh

# Run tests using a shared volume with the host
# docker build -t docengine:latest .
# docker run -i -v $(pwd):/project/ docengine:latest /project/bin/docker_shared_test.sh
