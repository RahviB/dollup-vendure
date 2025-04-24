FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose default port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
