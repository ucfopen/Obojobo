FROM node:9-alpine
RUN apk add --no-cache \
	build-base \
	git \
	python


# without mounting the host filesystem
# git clone -b issue/155-docker-container-for-ci --depth 1 https://github.com/ucfcdl/Obojobo-Document-Engine.git /docengine
# cd docengine
# docker build -t docengine:latest .
# docker run -it --name doc_box -d docengine:latest ash
# docker exec -it doc_box git clone -b issue/155-docker-container-for-ci --depth 1 https://github.com/ucfcdl/Obojobo-Document-Engine.git /docengine
# docker exec -it -w /docengine doc_box yarn
# docker exec -it -w /docengine doc_box yarn test --coverage
# docker stop doc_box

# with mounting the host filesystem
# git clone -b issue/155-docker-container-for-ci --depth 1 https://github.com/ucfcdl/Obojobo-Document-Engine.git /docengine
# cd docengine
# docker build -t docengine:latest .
# docker run -i -w /docengine -v $(pwd):/docengine/ docengine:latest yarn
# docker run -i -w /docengine -v $(pwd):/docengine/ docengine:latest yarn test --coverage
