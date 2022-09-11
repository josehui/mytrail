# Using slim image due to alpine bug on m1 mac
# For other platforms, use node:16-alpine

# Install dependencies only when needed
FROM node:16-slim AS deps
# RUN apk add --no-cache libc6-compat (For node:16-alpine)
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; fi


# Rebuild the source code only when needed
FROM node:16-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get update && apt-get -y install openssl
RUN npx prisma generate
RUN yarn build



# Production image, copy all the files and run next
FROM node:16-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get -y install openssl
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]