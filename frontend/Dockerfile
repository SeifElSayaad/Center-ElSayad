FROM node:18-alpine

WORKDIR /app

# Install global dependencies
RUN npm install -g expo-cli

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose ports for Expo (8081 for Metro bundler)
EXPOSE 8081

# Command to run the Expo app
CMD ["npm", "start"]
