# Base image for Node.js
FROM node:20.11.1-alpine3.19 AS build

# Set working directory
WORKDIR /app

# Exposing all our Node.js binaries
ENV PATH /app/node_modules/.bin:$PATH

# Copy package.json and package-lock.json first to utilize Docker cache
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Install dependencies with retry and longer timeouts to handle network issues
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm install --retry 3

# Add application source
COPY . /app

# Build React app
ENV REACT_APP_CHATTING_URL=http://sse-spring-app-service:8080
RUN npm run build

# Nginx for serving the built application
FROM nginx:latest

# Remove default nginx static resources
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy the React build from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx server in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]