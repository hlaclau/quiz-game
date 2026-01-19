# Multi-stage build for server app
FROM oven/bun:1.2.22 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock bunfig.toml ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build the server and its dependencies using Turbo
# The -- passes flags to the underlying turbo command
RUN bun run build -- --filter=server...

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and dependencies
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/package.json ./apps/server/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Expose port
EXPOSE 3000

# Run the server
WORKDIR /app/apps/server
CMD ["bun", "run", "dist/index.js"]
