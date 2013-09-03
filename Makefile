REPORTER ?= list
RJS ?="./node_modules/requirejs/bin/r.js"
build-dev:
	node $(RJS) -o utils/build_profiles/app.build.js
build-min:
	node $(RJS) -o utils/build_profiles/app.build.min.js
build: build-dev build-min
test:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) test/*.js

.PHONY: all build build-min build-dev test
