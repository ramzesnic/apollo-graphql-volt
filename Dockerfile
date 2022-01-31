FROM node:16

WORKDIR /code

RUN apt-get update
RUN npm install -g npm-check-updates
RUN npm i -g typeorm
RUN npm i -g ts-node
RUN npm i -g ts-node-dev
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
