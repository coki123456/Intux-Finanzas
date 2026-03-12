# Frontend Build Stage
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend Build & Production Stage
# Backend Build & Production Stage
# Cambiamos de alpine a slim e instalamos openssl explícitamente para solucionar
# de raíz la incompatibilidad de librerías nativas con Prisma. Usamos bookworm-slim explícito.
FROM node:20-bookworm-slim AS runner
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

# Copy ALL server files first
COPY server/ ./server/
# Copy .env to server folder so it can be loaded
COPY .env ./server/.env

# Explicitly REMOVE any rogue node_modules that might have been copied 
# from the host or cache before installing fresh Linux ones!
RUN rm -rf server/node_modules || true

# Force Prisma to use the binary engine type to avoid shared library linking (OpenSSL/musl) issues
ENV PRISMA_CLIENT_ENGINE_TYPE="binary"
ENV PRISMA_CLI_QUERY_ENGINE_TYPE="binary"

# Install dependencies and generate Prisma natively for Debian
RUN cd server && npm install
RUN cd server && npx prisma generate

# Copy frontend build into the server folder where Express expects it
COPY --from=frontend-builder /app/dist ./server/dist

WORKDIR /app/server
RUN npx tsc
EXPOSE 3000

# Run the compiled JS
CMD ["node", "dist/index.js"]
