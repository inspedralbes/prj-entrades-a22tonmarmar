# Base stage
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS dev
COPY . .
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS prod
ARG NUXT_SOCKETS_URL
ENV NUXT_SOCKETS_URL=$NUXT_SOCKETS_URL
COPY . .
RUN npm run build
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["node", ".output/server/index.mjs"]