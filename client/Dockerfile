FROM node:22-alpine AS builder
WORKDIR /app
COPY client/package*.json client/yarn.lock ./
RUN npm install 
COPY . .
EXPOSE 5173
RUN ["npm", "run", "dev"]
