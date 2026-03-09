# Build Stage for Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build Stage for Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY server/package*.json ./server/
# Copy prisma directory before npm install so postinstall script works
COPY server/prisma/ ./server/prisma/
RUN cd server && npm install
COPY server/ ./server/
RUN cd server && npx prisma generate

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Copy backend
COPY --from=backend-builder /app/server ./server

# Ensure we are in the server directory
WORKDIR /app/server
EXPOSE 3000

# We use ts-node for simplicity in this migration, but in a real prod env 
# we'd compile to JS. For Easypanel, this works fine.
CMD ["npm", "start"]
