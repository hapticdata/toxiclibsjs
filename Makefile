REPORTER ?= list

build-dev:
	node utils/r.js -o utils/build_profiles/app.build.js
build-min:
	node utils/r.js -o utils/build_profiles/app.build.min.js
build: build-dev build-min
test:
	mocha --reporter $(REPORTER) test/*

.PHONY: all build build-min build-dev test