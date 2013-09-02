REPORTER ?= list

build-dev:
	node utils/r.js -o utils/build_profiles/app.build.js
build-min:
	node utils/r.js -o utils/build_profiles/app.build.min.js
build: build-dev build-min
test:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) test/*.js

.PHONY: all build build-min build-dev test
