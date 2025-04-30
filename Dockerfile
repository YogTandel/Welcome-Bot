# Use Node.js 18 (Alpine is lightweight)
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Expose the PORT (optional, Fly.io ignores this but some apps need it)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]  # Replace "index.js" with your main bot file