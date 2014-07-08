#[Toxiclibsjs](http://haptic-data.com/toxiclibsjs) 
##an open-source library for computational design tasks with JavaScript. 

[![Spherical Harmonics in three.js](http://s3.amazonaws.com/toxiclibsjs/images/sphericalHarmonicsThree.jpg)](http://haptic-data.com/toxiclibsjs/examples/SphericalHarmonics_threejs.html)
[![polar_unravel](http://s3.amazonaws.com/toxiclibsjs/images/polarUnravel.gif)](http://haptic-data.com/toxiclibsjs/examples/PolarUnravel_pjs.html)
[![attraction2d](http://s3.amazonaws.com/toxiclibsjs/images/attraction2d.gif)](http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html)

Toxiclibs.js is a port of [Karsten Schmidt's Toxiclibs](http://toxiclibs.org) for Java and [Processing](http://processing.org). Toxiclibs.js provides powerful datatypes for the _browser_ and _node_. It works well for manipulating any DOM element, including Canvas and SVG.

The plethora of examples demonstrate its use for geometry and color manipulation as well as physics, automata and more. The examples pair with such fine libraries as: [Processing.js](http://processingjs.org), [Three.js](http://github.com/mrdoob/three.js), [D3.js](http://github.com/mbostock/d3) or [Raphael.js](http://raphaeljs.com).

##What it is…
-	2D/3D geometry
-	Mesh generation and subdivision
-	Interpolation / Mapping
-	Wave Generators
-	2D physics simulation
-	Color theory sorting and conversion



#Getting Started with Toxiclibs.js

Toxiclibs.js can be used in the following ways:

*	As a single javascript file loaded into a webpage, with the contents of the entire library within a global *toxi* object.
*	As [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules that can be loaded independently or in packages, via [RequireJS](http://requirejs.org)
*	In [Node.js](http://nodejs.org) applications, as AMD modules that require the 'requirejs' library for Node.js.

##Use the build
copy the file `build/toxiclibs.js`:

	<script type="text/javascript" src="js/toxiclibs.js"></script>
	<script type="text/javascript">
		var myVector = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight).scaleSelf(0.5);
		var myColor = toxi.color.TColor.newRGB(128/255,64/255,32/255);
	</script>
##Use with [RequireJS](http://requirejs.org) or other AMD loader
copy the contents of `lib/`:

	require(['toxi/geom/Vec2D', toxi/color/TColor], function(Vec2D, TColor){
		var myVector = new Vec2D(window.innerWidth,window.innerHeight).scaleSelf(0.5);
		var myColor = TColor.newRGB(128/255,64/255,32/255);
	});
##Use with [Node.js](http://nodejs.org):

	npm install toxiclibsjs
then:

	var	toxi = require('toxiclibsjs'),
		myVector = new toxi.geom.Vec2D(0.5,0.5),
		myColor = toxi.color.TColor.newRGB(128/255,64/255,32/255);

For comprehensive documentation, read the original libraries [javadocs](http://toxiclibs.org/javadocs/). As the library is still growing, you can compare that documentation to this list of implemented classes.


##Toxiclibs.js follows the original package structure
The following objects are returned when loading the entire library


* **color** - the color utils package ([view doc](https://github.com/hapticdata/toxiclibsjs/blob/master/docs/colorutils.md))
* **geom** - the geometry utils package
* *internals* - functionality used within the library
* **math** - the math utils package
* **physics2d** - the Verlet Physics 2D package
* **processing** - the processing package, eases use with [Processing.js](http://processingjs.org)
* **THREE** - features to ease use with [Three.js](http://github.com/mrdoob/three.js)
* **utils** - the utils package

##Creating Builds
Run `make` to generate new versions of the existing builds. There are additional targets defined in the [Makefile](https://github.com/hapticdata/toxiclibsjs/blob/release/Makefile)
###Custom builds
If you are working with the `build/` files you may wish to create a custom build that only includes the modules you are using in order to save file size. If you are [using the files as AMD modules](#use-with-requirejs-or-other-amd-loader) there is no need for this.

To generate a custom build, space-delimit the modules you want:

	./bin/toxiclibsjs --include "toxi/geom/Vec2D toxi/physics2d" --minify --out "./build/toxiclibsjs-custom.min.js"

##Run the tests
Run `make test` to run the suite of tests.

## Contributing
Contributions to toxiclibs.js are appreciated, please [read more here](https://github.com/hapticdata/toxiclibsjs/blob/master/docs/contributing.md)



[Toxiclibs.js](http://haptic-data.com/toxiclibsjs) was initiated on 1/5/2011 by Kyle Phillips [http://haptic-data.com](http://haptic-data.com)



This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

[http://creativecommons.org/licenses/LGPL/2.1/](http://creativecommons.org/licenses/LGPL/2.1/)

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
