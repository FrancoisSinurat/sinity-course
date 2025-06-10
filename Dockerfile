# Gunakan Node.js base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file project
COPY . .

# Build Next.js
RUN npm run build

# Jalankan Next.js menggunakan `start`
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "start"]
