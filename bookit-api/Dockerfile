# Backend Dockerfile for bookit-api
FROM node:20-alpine

WORKDIR /app

# copy package files to install dependencies
COPY package.json package-lock.json ./
COPY tsconfig.json ./

# install deps
RUN npm ci --production=false

# copy source
COPY . .

# build TypeScript
RUN npm run build

EXPOSE 3000

# Use the dist start script
CMD ["node", "dist/index.js"]
