FROM node:9-alpine
RUN apk add --no-cache \
	build-base \
	git \
	python

ADD bin/docker_clone_and_test.sh /bin/docker_clone_and_test.sh

CMD mkdir /project

ENV GIT_BRANCH=master
ENV GIT_REPO=https://github.com/ucfcdl/Obojobo-Document-Engine.git

# Run tests completely within the container
# docker build -t docengine:latest .
# docker run -i -e GIT_USER -e GIT_PASSWORD -e GIT_BRANCH docengine:latest /bin/docker_clone_and_test.sh

# Run tests using a shared volume with the host
# docker build -t docengine:latest .
# docker run -i -v $(pwd):/project/ docengine:latest /project/bin/docker_shared_test.sh
