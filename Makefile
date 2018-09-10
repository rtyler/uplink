# Root Makefile to make the building and testing of this project easier
# regardless of *nix based platform
PATH:=./node_modules/.bin:./tools:$(PATH)
COMPOSE:=./tools/docker-compose

all: build check

depends: package.json package-lock.json
	if [ ! -d node_modules ]; then \
			npm install; \
	fi;

build: depends
	tsc

check: depends
	jest

clean:
	$(COMPOSE) down || true
	rm -rf node_modules

debug-jest:
	node --inspect-brk=0.0.0.0:9229 ./node_modules/.bin/jest

debug-db:
	$(COMPOSE) run --rm db psql -h db -U postgres uplink_development

migrate: depends
	$(COMPOSE) up -d db
	@echo ">> waiting a bit to make sure the database comes online.."
	@sleep 5
	$(COMPOSE) run --rm node \
		/usr/local/bin/node ./node_modules/.bin/sequelize db:migrate

watch:
	jest --watchAll

watch-compile:
	tsc -w

run: build
	@echo ">> Make sure you run migrations first!"
	@sleep 1
	$(COMPOSE) up

.PHONY: all depends build clean check watch run

# vim: set et
