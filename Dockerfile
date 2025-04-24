FROM node:20-alpine

WORKDIR /app

# Install all dependencies including devDependencies (required for @vendure/ui-devkit)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the project (compiles TS and admin-ui)
RUN npm run build

# Expose default port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
