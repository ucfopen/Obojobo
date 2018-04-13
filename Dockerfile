FROM node:9-alpine
RUN apk add --no-cache \
	build-base \
	git \
	python


# docker build -t docengine:3.3.0
# docker volume create docengine-node-modules
# docker run -it docengine:3.3.0 ash
# docker run -i -t -v $(pwd):/docengine/ -v docengine-node-modules:/docengine_node_modules docengine:3.3.0 ash

--modules-folder /docengine_node_modules
