# Root Makefile to make the building and testing of this project easier
# regardless of *nix based platform
PATH:=$(PWD)/tools:$(PATH)
TSC=$(PWD)/node_modules/typescript/bin/tsc
JEST=$(PWD)/node_modules/jest/bin/jest.js
SEQUELIZE=$(PWD)/node_modules/sequelize-cli/lib/sequelize
COMPOSE:=./tools/docker-compose

all: build check

depends: package.json package-lock.json
	if [ ! -d node_modules ]; then npm install; fi;

build: depends
	$(TSC)

check: build depends migrate
	$(JEST) --bail

clean:
	$(COMPOSE) down || true
	rm -rf node_modules

debug-jest:
	node --inspect-brk=0.0.0.0:9229 $(JEST)

debug-db:
	$(COMPOSE) run --rm db psql -h db -U postgres uplink_development

generate-event:
	curl -d '{"type":"stapler", "correlator" : "my-correlator-id", "payload" : {"timestamp" : "$(shell date)", "hi" : "there"}}' \
	    -H "Content-Type: application/json" \
	    http://localhost:3030/events

migrate: depends
	$(COMPOSE) up -d db
	@echo ">> waiting a moment to make sure the database comes online.."
	@sleep 1
	$(COMPOSE) run --rm node \
		/usr/local/bin/node $(SEQUELIZE) db:migrate

watch: migrate
	# Running with docker-compose since our tests require a database to be
	# present
	$(COMPOSE) run --rm node \
		/usr/local/bin/node $(JEST) --watchAll --bail --forceExit

watch-compile:
	$(TSC) -w

run: build
	@echo ">> Make sure you run migrations first!"
	@sleep 1
	$(COMPOSE) up

.PHONY: all depends build clean check watch run

# vim: set et
