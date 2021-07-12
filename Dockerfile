# # Install dependencies stage
# # Install dependencies only when needed
# FROM node:alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /usr/app
# COPY package.json package-lock.json ./
# RUN npm ci

# # Build stage
# # Rebuild the source code only when needed
# FROM node:alpine AS builder
# WORKDIR /usr/app
# RUN apk update && apk add --no-cache make


# ARG GITHUB_SHA=undefined_version
# RUN echo ${GITHUB_SHA}
# # Install all deps
# ADD package.json /tmp/package.json
# ADD package-lock.json /tmp/package-lock.json
# RUN cd /tmp && npm ci
# RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app
# RUN apk update && apk add --no-cache make
# WORKDIR /usr/app

# COPY . /usr/app/

# # Запускаем сборку
# RUN APP_VERSION=${GITHUB_SHA:0:7} make production

# # --------

# FROM docker.pkg.github.com/artem-malko/challenges-time-frontend/challenges-frontend:latest AS exists-build-env

# # --------
# # Стадия подготовки image к бою
# FROM node:alpine
# RUN apk update && apk add --no-cache make
# COPY --from=build-env /usr/app/tools/removeOldFiles.js /usr/app/tools/${GITHUB_SHA}_removeOldFiles.js
# # Копируем артефакты предыдущих сборок
# COPY --from=exists-build-env /usr/app/build /usr/app/build
# WORKDIR /usr/app
# # Удаляем файлы старше 90 дней
# RUN node ./tools/${GITHUB_SHA}_removeOldFiles.js
# RUN rm ./tools/${GITHUB_SHA}_removeOldFiles.js
# # Копируем артефакт сборки из стадии "build-env" в указанный файл
# COPY --from=build-env /usr/app/build /usr/app/build
# COPY package.json /usr/app/
# COPY Makefile /usr/app/

# ENV SERVER_PORT=5000

# EXPOSE 5000
# CMD ["make", "start-prod"]
