FROM node:18-alpine3.17 AS build

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM ubuntu

RUN apt-get update
RUN apt-get install nginx -y
RUN apt-get install curl -y

COPY --from=build /app/dist /var/www/html/
COPY ./nginx.conf /etc/nginx/sites-enabled/default
EXPOSE 80
CMD ["nginx","-g","daemon off;"]