# Root Makefile to make the building and testing of this project easier
# regardless of *nix based platform
PATH:=./node_modules/.bin:./tools:$(PATH)

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
	rm -rf node_modules

debug-jest:
	node --inspect-brk=0.0.0.0:9229 ./node_modules/.bin/jest

watch:
	jest --watchAll

watch-compile:
	tsc -w

run: build
	nodemon build/


.PHONY: all depends build clean check watch run

# vim: set et
