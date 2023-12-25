# Based on best pratices provided by Snyk.io
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

# --------------> The build image
FROM node:21.5.0-bullseye-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /app

COPY package*.json /app
RUN npm ci

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package*.json ./
RUN npm prune --omit=dev

# --------------> The production image
FROM base

ENV NODE_ENV production
COPY --from=base /usr/bin/dumb-init /usr/bin/dumb-init

USER node

WORKDIR /app
COPY --chown=node:node --from=production-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node . .

CMD ["dumb-init", "node", "dist/index.js"]