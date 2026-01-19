# Multi-stage build for web app (TanStack Start SSR)
FROM oven/bun:1.2.22 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock bunfig.toml ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .

# Build the web app using Turbo
# The -- passes flags to the underlying turbo command
RUN bun run build -- --filter=web...

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built artifacts and dependencies
COPY --from=builder /app/apps/web/.output ./apps/web/.output
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/vite.config.ts ./apps/web/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Expose port
EXPOSE 3001

# Run the SSR server using vite preview
WORKDIR /app/apps/web
CMD ["bun", "run", "serve", "--", "--port", "3001", "--host"]
