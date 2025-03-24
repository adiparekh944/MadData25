# Stage 1 - Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile --no-cache

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Stage 2 - NGINX Production Stage
FROM nginx:1.23.3-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the default NGINX port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
