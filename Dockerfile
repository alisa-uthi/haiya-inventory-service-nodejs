FROM node:16-alpine3.12

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "run", "watch" ]
