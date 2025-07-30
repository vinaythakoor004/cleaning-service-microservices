# ./angularApp/Dockerfile
FROM node:18
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Install Angular CLI and app dependencies
RUN npm install -g @angular/cli --frozen-lockfile

RUN npm install --frozen-lockfile

COPY . .

# Start dev server with proxy config
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--proxy-config", "proxy.config.json"]
