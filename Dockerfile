FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Generate Prisma client
RUN npx prisma generate

COPY . .

ENV NODE_ENV=production