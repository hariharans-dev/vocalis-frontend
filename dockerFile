FROM ubuntu:22.04
WORKDIR /app
RUN apt update && apt install -y nodejs npm
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm","run","dev"]