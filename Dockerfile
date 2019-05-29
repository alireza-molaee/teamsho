FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY ./openapi.yaml ./openapi.yaml

RUN mkdir /uploads

EXPOSE 8080

CMD [ "node", "./build/index.js" ]