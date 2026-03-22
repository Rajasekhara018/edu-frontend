# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the Angular app
RUN npm run build -- --configuration production

# Serve stage
FROM node:18-alpine

WORKDIR /app

# Install http-server to serve the static files
RUN npm install -g http-server

# Copy built app from build stage
COPY --from=build /app/dist/electrical-sales ./dist/electrical-sales

# Expose port
EXPOSE 8080

# Start the app
CMD ["http-server", "dist/electrical-sales", "-p", "8080"]
