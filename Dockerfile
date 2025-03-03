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

ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_SECRET
ARG NEXT_PUBLIC_SESSION_EXPIRE

RUN echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env && \
    echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env && \
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env && \
    echo "NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL" >> .env && \
    echo "NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL" >> .env && \
    echo "NEXT_PUBLIC_FRONTEND_SECRET=$NEXT_PUBLIC_FRONTEND_SECRET" >> .env && \
    echo "NEXT_PUBLIC_SESSION_EXPIRE=$NEXT_PUBLIC_SESSION_EXPIRE" >> .env

RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
