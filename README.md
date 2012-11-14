#[Toxiclibsjs](http://haptic-data.com/toxiclibsjs) 
##an open-source library for computational design tasks with JavaScript. 

Toxiclibs.js is a port of [Karsten Schmidt's Toxiclibs](http://toxiclibs.org) for Java and [Processing](http://processing.org). Toxiclibs.js works great with any DOM element, such as Canvas and SVG. The library is also available for use with [Node.js](http://nodejs.org) for desktop applications and servers. Examples pair with such fine libraries as: [Processing.js](http://processingjs.org), [Three.js](http://github.com/mrdoob/three.js), or [Raphael.js](http://raphaeljs.com) for SVG.

##What it is…
-	2D/3D geometry
-	Mesh generation and subdivision
-	Interpolation / Mapping
-	Wave Generators
-	2D physics simulation
-	Color theory sorting and conversion



### A few examples
[![Spherical Harmonics in three.js](http://haptic-data.com/toxiclibsjs/img/spherical_harmonics.jpg)](http://haptic-data.com/toxiclibsjs/examples/SphericalHarmonics_threejs.html)
[![additive_waves](http://haptic-data.com/toxiclibsjs/img/additive_waves.jpg)](http://haptic-data.com/toxiclibsjs/examples/AdditiveWaves_pjs-webgl.html)
[![polar_unravel](http://haptic-data.com/toxiclibsjs/img/polar_unravel.gif)](http://haptic-data.com/toxiclibsjs/examples/PolarUnravel_pjs.html)
[![attraction2d](http://haptic-data.com/toxiclibsjs/img/physics2d_attraction2d.gif)](http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html)


#Getting Started with Toxiclibs.js

Toxiclibs.js can be used in the following ways:

*	As a single javascript file loaded into a webpage, with the contents of the entire library within a global *toxi* object.
*	As [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules that can be loaded independently or in packages, via [RequireJS](http://requirejs.org)
*	In [Node.js](http://nodejs.org) applications, as AMD modules that require the 'requirejs' library for Node.js.

To use as a single javascript file, copy the file `build/toxiclibs.js`:

	<script type="text/javascript" src="js/toxiclibs.js"></script>
	<script type="text/javascript">
		var myVector = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight).scaleSelf(0.5);
		var myColor = toxi.color.TColor.newRGB(128/255,64/255,32/255);
	</script>
To use with [RequireJS](http://requirejs.org), copy the contents of `lib/`:

	require(['toxi/geom/Vec2D', toxi/color/TColor], function(Vec2D, TColor){
		var myVector = new Vec2D(window.innerWidth,window.innerHeight).scaleSelf(0.5);
		var myColor = TColor.newRGB(128/255,64/255,32/255);
	});
To use with [Node.js](http://nodejs.org):

	npm install toxiclibsjs
then:

	var	toxi = require('toxiclibsjs'),
		myVector = new toxi.geom.Ve2D(0.5,0.5),
		myColor = toxi.color.TColor.newRGB(128/255,64/255,32/255);

For comprehensive documentation, read the original libraries [javadocs](http://toxiclibs.org/javadocs/). As the library is still growing, you can compare that documentation to this list of implemented classes.


## Toxiclibs.js follows the original package structure
The following objects are returned when loading the entire library


* **color** - the color utils package
* **geom** - the geometry utils package
* *internals* - functionality used within the library
* **math** - the math utils package
* **physics2d** - the Verlet Physics 2D package
* **processing** - the processing package, eases use with [Processing.js](http://processingjs.org)
* **THREE** - features to ease use with [Three.js](http://github.com/mrdoob/three.js)
* **utils** - the utils package





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