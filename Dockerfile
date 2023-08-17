# Based on best pratices provided by Snyk.io
# https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/

# base node image
FROM node:20-bullseye-slim as base

# set for base and all layer that inherit from it
# ENV NODE_ENV production

# Install all noe_modules, including dev dependencies
FROM base as deps

WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install

# Build the app
FROM base as build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN yarn build

# Setup production node_modules
FROM base as production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json yarn.lock ./
RUN yarn install --production

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build /app/dist /app/dist
ADD . .

CMD ["node", "dist/index.js"]