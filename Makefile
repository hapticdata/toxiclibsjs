REPORTER ?= list
MOCHA_OPTS= --check-leaks

all: toxiclibs.js toxiclibs.min.js
toxiclibs.js:
	./bin/toxiclibsjs --out "./build/toxiclibs.js"
toxiclibs.min.js:
	./bin/toxiclibsjs --out "./build/toxiclibs.min.js" --minify
toxiclibs-core.min.js:
	./bin/toxiclibsjs --include "toxi/geom toxi/math toxi/util" --minify --out "./build/toxiclibs-core.min.js"
toxiclibs-color.min.js:
	./bin/toxiclibsjs --include "toxi/color" --out "./build/toxiclibs-color.min.js" --minify
toxiclibs-physics2d.js:
	./bin/toxiclibsjs --include "toxi/physics2d" --out "./build/toxiclibs-physics2d.js"
toxiclibs-physics2d.min.js:
	./bin/toxiclibsjs --include "toxi/physics2d" --out "./build/toxiclibs-physics2d.min.js" --minify
toxiclibs-physics3d.js:
	./bin/toxiclibsjs --include "toxi/internals toxi/geom/Vec3D toxi/geom/Ray3D toxi/geom/AxisAlignedCylinder toxi/geom/AABB toxi/physics3d" --out "./build/toxiclibs-physics3d.js"
toxiclibs-physics3d.min.js:
	./bin/toxiclibsjs --include "toxi/internals toxi/geom/Vec3D toxi/geom/Ray3D toxi/geom/AxisAlignedCylinder toxi/geom/AABB toxi/physics3d" --out "./build/toxiclibs-physics3d.min.js" --minify

publish:
	rm -rf ./commonjs
	node ./bin/convert-to-commonjs.js
	npm publish ./commonjs

test:
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) test/*.js $(MOCHA_OPTS)

.PHONY: test
