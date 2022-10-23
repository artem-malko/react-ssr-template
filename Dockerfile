# Install dependencies stage
# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci

# Build stage
# Rebuild the source code only when needed
FROM node:alpine AS builder

ARG GITHUB_SHA=undefined_version
RUN echo ${GITHUB_SHA}

WORKDIR /usr/app
RUN apk update && apk add --no-cache make

COPY . .
COPY --from=deps /usr/app/node_modules ./node_modules

RUN APP_VERSION=${GITHUB_SHA:0:7} make production


# Prev build
# We will take the old builds to have it in a new image
# That builds will be used to store prev files,
# which can be requested by browser cache, bots and so on
# You have to specify your own image here
FROM ghcr.io/artem-malko/react-ssr-template/node-app:latest AS exists-build


# Production image, copy all the files and run it
FROM node:alpine
ARG  SERVER_PORT=5000

RUN apk update && apk add --no-cache make

WORKDIR /usr/app

COPY --from=builder /usr/app/tools/removeOldFiles.js ./tools/${GITHUB_SHA}_removeOldFiles.js
# Copy artifacts from the last builds
COPY --from=exists-build /usr/app/build ./build
# Remove all old files
# Check ./tools/removeOldFiles.js for more info
RUN node ./tools/${GITHUB_SHA}_removeOldFiles.js
RUN rm ./tools/${GITHUB_SHA}_removeOldFiles.js
# Copy the new build
COPY --from=builder /usr/app/build ./build

COPY Makefile /usr/app/
COPY data.json /usr/app/

EXPOSE $SERVER_PORT
CMD ["make", "start-prod"]
