#Toxiclibs.js CHANGES
##v0.1.3
*	wrote new unit tests for TColor, and ported all qunit unit tests to mocha
*	added docs/sugar.md to explain the added features of toxiclibs.js
*	added toxi.color.TColor#toInt for numbers in integer form, such as in three.js
*	added toxi.color.TColor#newCSS to ease converting any css color to TColor
*	bugfix toxi.color.TColor#addSelf
*	bugfix toxi.geom.mesh.TriangleMesh#computeVertexNormals returning NaN
*	bugfix toxi.geom.mesh.TriangleMesh#updateVertex
*	Updated toxi.THREE.ToxiclibsSupport to remove used of deprecated THREE.Vertex
*	AABB, Vec3D, Vec2D, Sphere.toMesh and Circle -> Ellipse circular dependencies resolved
*	TriangleMesh.center now takes a callback for updating bounding box
*	bugfixes for toxi.physics2d.constraings.CircularConstraint and toxi.geom.Triangle2D
*	bugfixes for passing points into toxi.geom.Spline2D
*	support for options object in toxi.geom.Spline2D constructor

##v0.1.2
*	Resolved [Issue 18](https://github.com/hapticdata/toxiclibsjs/issues/18) TriangleMesh.getBoundingBox and TriangleMesh.getBoundingSphere are now async methods to prevent circular dependency
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
