# Use official Node.js image (latest LTS)
FROM node:20-alpine 

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
