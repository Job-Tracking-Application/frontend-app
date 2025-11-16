# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy built frontend files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
