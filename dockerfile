FROM node:12

EXPOSE 3000

RUN apt-get update

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

CMD ["npm", "start"]