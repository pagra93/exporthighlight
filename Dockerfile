# Multi-stage build ULTRA-OPTIMIZADO para 4GB RAM
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# === OPTIMIZACIÓN EXTREMA: npm ci con restricciones máximas ===
RUN npm ci \
    --prefer-offline \
    --no-audit \
    --no-fund \
    --loglevel=error \
    --maxsockets=1 \
    && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# === ACEPTA VARIABLES DE BUILD QUE VIENEN DE COOLIFY ===
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# === EXPÓNLAS PARA EL PROCESO DE BUILD DE NEXT ===
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# === OPTIMIZACIÓN EXTREMA: Limitar RAM al máximo ===
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Heap reducido a 2.5GB (dejar margen para el sistema)
ENV NODE_OPTIONS="--max-old-space-size=2560"
# Desactivar source maps para ahorrar RAM
ENV GENERATE_SOURCEMAP=false

# Build con límite de memoria estricto
RUN npm run build && \
    # Limpiar cache de Next.js para liberar espacio
    rm -rf .next/cache

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Límite de RAM para runtime (mucho menor que build)
ENV NODE_OPTIONS="--max-old-space-size=512"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy public directory (now it exists in the project)
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# === ACEPTA VARIABLES DE BUILD EN LA ETAPA RUNNER ===
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# === EXPÓNLAS PARA EL RUNTIME ===
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

