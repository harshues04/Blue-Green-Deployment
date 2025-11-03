# Use Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (optional for documentation)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
