FROM node

RUN apt-get update

RUN apt-get install libssl-dev

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]