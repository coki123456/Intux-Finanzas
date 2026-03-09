# Frontend Build Stage
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend Build & Production Stage
# Cambiamos de alpine a slim e instalamos openssl explícitamente para solucionar
# de raíz la incompatibilidad de librerías nativas con Prisma
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl
WORKDIR /app

# Copy server files and install dependencies
COPY server/package*.json ./server/
COPY server/prisma/ ./server/prisma/
RUN cd server && npm install

COPY server/ ./server/
RUN cd server && npx prisma generate

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

WORKDIR /app/server
RUN npx tsc
EXPOSE 3000

# Run the compiled JS
CMD ["node", "dist/index.js"]
