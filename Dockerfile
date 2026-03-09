# Build Stage for Frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build Stage for Backend
FROM node:20-alpine as backend-builder
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/
RUN cd server && npx prisma generate

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Copy backend
COPY --from=backend-builder /app/server ./server
COPY --from=backend-builder /app/node_modules ./node_modules

WORKDIR /app/server
EXPOSE 3000

# We use ts-node for simplicity in this migration, but in a real prod env 
# we'd compile to JS. For Easypanel, this works fine.
CMD ["npm", "start"]
