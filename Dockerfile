FROM keymetrics/pm2:latest-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir /uploads

EXPOSE 8080

CMD [ "pm2-runtime", "./build/index.js" ]