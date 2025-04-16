FROM node:22

WORKDIR /server/app

# Install dependencies
COPY package*.json ./

# Copy the rest of your source code
COPY . .

RUN npm install
# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Start the dev server with nodemon
CMD ["npm", "run", "start"]
