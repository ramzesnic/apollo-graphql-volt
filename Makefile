all: compose-setup

prepare:
	touch .bash_history
	touch .env

compose:
	docker-compose up

compose-install:
	docker-compose run web npm install

compose-setup: prepare compose-build compose-install compose-db-setup

compose-db-setup:
	docker-compose run web npx sequelize db:migrate

compose-kill:
	docker-compose kill

compose-build:
	docker-compose build

compose-test:
	docker-compose run web make test

compose-bash:
	docker-compose run web bash

compose-lint:
	docker-compose run web npm run lint

start:
	DEBUG="application:*" npm run start-dev

compose-dist-build:
	rm -rf dist
	docker-compose run web npm run build

compose-publish: compose-dist-build
	docker-compose run web npm publish

test:
	npm test

lint:
	npm run lint

.PHONY: test
