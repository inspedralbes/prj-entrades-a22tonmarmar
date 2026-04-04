# Base stage
FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install

# Development stage
FROM base AS dev
COPY . .
ENV HOST=0.0.0.0
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/.output ./.output
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["node", ".output/server/index.mjs"]