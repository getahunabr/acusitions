# Multi-stage Dockerfile for Node.js application
# Stage 1: Base image with Node.js
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Stage 2: Development dependencies
FROM base AS deps
RUN npm ci --include=dev

# Stage 3: Production dependencies
FROM base AS production-deps
RUN npm ci --omit=dev && npm cache clean --force

# Stage 4: Build stage (for any build processes if needed)
FROM deps AS build
COPY . .
# Add any build commands here if needed
# RUN npm run build

# Stage 5: Development stage
FROM deps AS development
COPY . .
EXPOSE 3000
USER node
CMD ["dumb-init", "node", "--watch", "src/index.js"]

# Stage 6: Production stage
FROM production-deps AS production
COPY --from=build --chown=node:node /usr/src/app .
EXPOSE 3000
USER node
CMD ["dumb-init", "node", "src/index.js"]