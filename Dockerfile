FROM node:10

RUN npm install pm2 -g

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./openapi.yaml ./openapi.yaml

RUN mkdir /uploads

EXPOSE 8080

CMD [ "pm2", "start", "./build/index.js" ]