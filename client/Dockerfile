FROM node:22

WORKDIR /client/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

EXPOSE 5173

# # Build the client app (make sure your build script is defined in package.json)
RUN npm run build

# Command to run the client app (if applicable for production)
CMD ["sh", "-c", "npm run dev -- --host"]
