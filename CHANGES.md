#Toxiclibs.js CHANGES

##v0.1.2
*	Resolved [Issue 18](https://github.com/hapticdata/toxiclibsjs/issues/18) TriangleMesh#getBoundingBox and TriangleMesh#getBoundingSphere are now async methods to prevent circular dependency
*	Added `toxi/geom/mesh/Terrain`
*	Added UV's to `toxi/geom/mesh/SurfaceMeshBuilder`
*	Added UV's to `toxi/geom/AABB`
*	Added `toxi/geom/mesh/OBJWriter`
	*	OBJ string can be retrieved with `OBJWriter#getOutput()`
*	Added `TriangleMesh#saveAsOBJ()`

##v0.1.1
*	`ParticleString2D#clear()` bugfix
*	removed all uses of 'instanceof' test, replaced with property testing
*	`toxi/THREE/ToxiclibsSupport` updated for latest revision of Three.js and now usable as an AMD module
*	Rect#setDimensions bugfix
*	Line2D#scale bugfix
*	Triangle2D#getCircumCircle bugfix

##v0.1.0
*	 released as [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules,for use with [RequireJS](http://requirejs.org) or [Node.js](http://nodejs.org)
*	 packaging changed to conform to Java lib packages
*	 published to [NPM](http://npmjs.org/)
*	 new classes
	*		 `toxi.math.noise.PerlinNoise`
	*		 `toxi.math.noise.simplexNoise`
	*		 `toxi.math.conversion.unitTranslator`
	*		 `toxi.processing.ToxiclibsSupport`
	*		 `toxi.THREE.ToxiclibsSupport`
*	all examples edited for updated lib packaging
*	new examples
	*		PerlinNoise_canvas.html
	*		SimplexNoise_canvas.html
*	 bugfix on `toxi.geom.Vec3D#scaleSelf`
*	 build files are now available as `toxiclibs.js` and `toxiclibs.min.js`
* 	 process for producing build/ files changed to use [r.js](http://github.com/jrburke/r.js) and [Uglify.js](https://github.com/mishoo/UglifyJS) and uses [almond](http://github.com/jrburke/r.js) to provide a light-weight require shim.
*	 markdown documentation added to docs/