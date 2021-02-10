FROM nginx:stable-alpine

COPY ./docker/config/nginx/nginx-prod-with-load-balancer.conf /etc/nginx/nginx.conf
