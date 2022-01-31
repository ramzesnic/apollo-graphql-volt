FROM node:16

WORKDIR /code


COPY package*.json ./

RUN echo 'deb http://deb.debian.org/debian stretch-backports main' >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get -t stretch-backports install -yq libsqlite3-0
RUN npm install -g npm-check-updates
RUN npm i -g ts-node
RUN npm i -g ts-node-dev
RUN npm i -g sequelize-cli
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
