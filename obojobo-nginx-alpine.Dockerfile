FROM nginx:stable-alpine

COPY ./config/nginx/nginx-prod-with-load-balancer.conf /etc/nginx/nginx.conf
