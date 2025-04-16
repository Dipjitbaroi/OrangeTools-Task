# Dockerfile for the server (server/Dockerfile)
FROM node:22-alpine

WORKDIR /app
COPY package*.json yarn.lock ./
RUN npm install 
COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]