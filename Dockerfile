FROM node:16.20.0-alpine3.16

WORKDIR /backend
RUN npm install -g nodemon
COPY backend/ .