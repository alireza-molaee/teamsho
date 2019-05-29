FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY ./build .

COPY ./openapi.yaml ./openapi.yaml

RUN mkdir /uploads

EXPOSE 8080

CMD [ "node", "./index.js" ]