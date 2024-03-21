# Stage 1: Build the application
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:ssr

# Stage 2: Serve the app with Node.js
FROM node:18

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

RUN npm install express

EXPOSE 4000

CMD ["node", "dist/app/server/main.js"]
