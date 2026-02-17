# Multi-stage build for Discover Chula Vista
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install dependencies (incluye devDependencies necesarios para build)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application
# This creates /app/dist (server) and /app/dist/public (frontend)
RUN pnpm build

# -----------------
# Production stage
# -----------------
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Copy package files
COPY package.json pnpm-lock.yaml drizzle.config.ts ./
COPY patches ./patches

# Install all dependencies (incluyendo devDependencies) para evitar error de 'vite' en runtime
RUN pnpm install --no-frozen-lockfile

# Copy built application from builder stage
# /app/dist (server) -> ./dist
# /app/dist/public (frontend) -> ./dist/public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/shared ./shared

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
