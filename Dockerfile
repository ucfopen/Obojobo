FROM node:6.9-alpine
RUN apk add --no-cache \
	build-base \
	git \
	python

# Install yarn - borrowed from https://github.com/nodejs/docker-node/blob/9023f588717d236a92d91a8483ff0582484c22d1/9/alpine/Dockerfile
ENV YARN_VERSION 1.5.1

RUN apk add --no-cache --virtual .build-deps-yarn curl gnupg tar \
  && for key in \
    6A010C5166006599AA17F08146C2130DFD2497F5 \
  ; do \
    gpg --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys "$key" || \
    gpg --keyserver hkp://ipv4.pool.sks-keyservers.net --recv-keys "$key" || \
    gpg --keyserver hkp://pgp.mit.edu:80 --recv-keys "$key" ; \
  done \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc" \
  && gpg --batch --verify yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && mkdir -p /opt \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -s /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz.asc yarn-v$YARN_VERSION.tar.gz \
  && apk del .build-deps-yarn

CMD mkdir /project

# set some default env vars
ENV GIT_BRANCH=master
ENV GIT_REPO=https://github.com/ucfcdl/Obojobo-Document-Engine.git

# this will set the credential helper to use environment variables when git over http asks for it
RUN git config --global credential.helper '!f() { sleep 1; printf "username=${GIT_USER}\npassword=${GIT_PASSWORD}"; }; f'

# Run tests completely within the container
# docker build -t docengine:latest .
# docker run -i -e GIT_USER -e GIT_PASSWORD -e GIT_BRANCH docengine:latest /bin/docker_clone_and_test.sh

# Run tests using a shared volume with the host
# docker build -t docengine:latest .
# docker run -i -v $(pwd):/project/ -w /project -e GIT_USER -e GIT_PASSWORD docengine:latest yarn install --force
# docker run -i -v $(pwd):/project/ -w /project docengine:latest yarn test:ci
