FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Start the dev server with nodemon
CMD ["npm", "run", "dev"]
