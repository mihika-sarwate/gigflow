FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY server/ ./

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
