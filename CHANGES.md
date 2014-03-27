#Toxiclibs.js CHANGES

##v0.2.7
* another version bump due to NPM failing publish

##v0.2.6
* version bump due to NPM's `503 backend unhealthy`
* cleaned up `toxi/math/*.js` modules

##v0.2.5
* resolve [issue #28](https://github.com/hapticdata/toxiclibsjs/issues/28), toxi.geom.mesh.BezierPatch fails w/o Vec3D[][]
* bugfix Vec2D#to3D** functions shouldn't have nested requires

##v0.2.4
*   improved `toxi.THREE.ToxiclibsSupport.createMeshGeometry( triMesh, [geom] ):THREE.Geometry` to avoid duplicated vertices
*   bugfix resolve [issue #27](https://github.com/hapticdata/toxiclibsjs/issues/27) where `toxi.physics2d.constraints.RectConstraint`, `toxi.physics2d.constraints.AngularConstraint` and `toxi.physics2d.ParticlePath2D` had missing require's
*   added `toxi.geom.Polygon2D#getBounds():Rect`
*   added `toxi.geom.Rect.getBoundingRect( points ):Rect`
*   added `toxi.geom.Rect#growToContainPoint( point ):Rect`
*   fixed possible _"module toxi/geom/Circle has not been loaded yet…"_ error from Require.js when loading only `toxi.geom.Polygon2D` with Require.js.
*   added `bower.json`

##v0.2.3
*   bugfix resolved [issue #26](https://github.com/hapticdata/toxiclibsjs/issues/26) where `toxi.geom.Spline3D` and `toxi.geom.Spline2D` had incorrect number of computed vertices.

##v0.2.2
*   bugfix case-sensitivity on loading modules `toxi/color/accessCriteria`, `toxi/color/namedColor`, `toxi/color/theory/colorTheoryRegistry`

##v0.2.1
*   bugfix `toxi.geom.Ray2D#toLine2DWithPointAtDistance` having `undefined` Line2D
*   added `toxi.geom.Line3D#toRay3D`
*   bugfix `toxi.math.waves.*` defaulting to an offset of 1 _(instead of 0)_ when not specified
*   bugfix `toxi.math.noise.simplexNoise` throwing error in older browsers not supported Typed-Arrays
*   removed `toxi.internals.Float32Array` and `toxi.internals.Int32Array` polyfills
*   added `toxi.internals.has#typedArrays` for Typed-Arrays support testing

##v0.2.0
*	**completed _100%_ of _colorutils_** - `toxi.color` and `toxi.color.theory` packages with thorough test coverage
*	completed `toxi.geom.Spline3D` and corresponding unit tests
*	completed `toxi.geom.LineStrip3D` and corresponding unit tests
*	completed `toxi.geom.SutherlandHodgemanClipper` and unit tests
*	`toxi.THREE.ToxiclibsSupport` now uses toxiclibs` normals
*	renamed `toxi.utils` to `toxi.util` for consistency
*	`toxi.geom.Polygon2D` renamed `#containsPoly()` to `#containsPolygon()`
*	new methods for `toxi.geom.Polygon2D` post toxiclibs 0020 release, including  `#center()`, `#get()`,
`#getBoundingCircle()`, `#getClosestPointTo()`, `#getClosestVertexTo()`, `#getNumVertices (deprecated #getNumPoints() )`,
`#getRandomPoint()`,`#increaseVertexCount()`, `#intersectsPolygon()`, `#removeDuplicates()`,`Polygon2D.fromBaseEdge()`,
`Polygon2D.fromEdgeLength()`, `Polygon2D.getRadiusForEdgeLength()`
*	bugfix `toxi.geom.Polygon2D#translate()`
*	bugfix for `toxi.math.MathUtils`'s `#max()` and `#min()` receiving 0 as falsey 3rd param
*	bugfix `toxi.geomVec2D#equalsWithTolerance()` if vector is null should return false
*	bugfix `toxi.math.MathUtils#random()` if one parameter is passed and its an integer, return an integer
*	updated node dependencies to `require.js >= 2.0`, `almond ~0.2.6` and `mocha >=1.12.0`, no longer requiring global mocha
*	produced new builds with latest
*	removed `utils/` contents used for old builds
*	developed build process for creating custom-builds that only includes requested module

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
