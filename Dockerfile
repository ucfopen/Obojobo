FROM node:9-alpine
RUN apk add --no-cache \
	build-base \
	git \
	python


# docker build -t docengine:3.3.0
# docker run -i -w /docengine -v $(pwd):/docengine/ docengine:3.3.0 yarn test --coverage
