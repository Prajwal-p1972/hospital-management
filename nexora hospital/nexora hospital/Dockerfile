FROM node:20-alpine

WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

EXPOSE 5173

# Start Vite server bound to 0.0.0.0 and port 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
