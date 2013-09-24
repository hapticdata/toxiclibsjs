REPORTER ?= list
MOCHA_OPTS= --check-leaks

all: toxiclibs.js toxiclibs.min.js
toxiclibs.js:
	./bin/toxiclibsjs --out "./build/toxiclibs.js"
toxiclibs.min.js:
	./bin/toxiclibsjs --out "./build/toxiclibs.min.js" --minify
toxiclibs-color.min.js:
	./bin/toxiclibsjs --include "toxi/color" --out "./build/toxiclibs-color.min.js" --minify

test:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) test/*.js $(MOCHA_OPTS)

.PHONY: test
