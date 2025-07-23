# ./angularApp/Dockerfile
FROM node:18
WORKDIR /app

COPY . .

# Install Angular CLI and app dependencies
RUN npm install -g @angular/cli
RUN npm install

# Start dev server with proxy config
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--proxy-config", "proxy.config.json"]
