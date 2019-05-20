FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY ./build .

COPY ./openapi.yaml ./openapi.yaml

RUN mkdir /uploads

VOLUME /uploads

EXPOSE 8080

RUN npm run build

CMD [ "node", "./build/index.js" ]