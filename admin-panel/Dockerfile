FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using legacy-peer-deps to avoid upstream conflicts with Vite/Tailwind)
RUN npm install --legacy-peer-deps

# Copy all source
COPY . .

EXPOSE 5173

# Kept empty here, handled by docker-compose command
