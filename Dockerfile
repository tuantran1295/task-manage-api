FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production

CMD[ "node", "src/app.js" ]