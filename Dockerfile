FROM node:latest

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "run", "watch" ]
