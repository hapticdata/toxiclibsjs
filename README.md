[Toxiclibsjs](http://haptic-data.com/toxiclibsjs) is an open-source library for computational design tasks with JavaScript. It is a port of [Karsten Schmidt's Toxiclibs](http://toxiclibs.org) for Java and Processing. Toxiclibs.js works great with Canvas, with SVG or any ordinary DOM element. Examples pair with such fine libraries as: [Processing.js](http://processingjs.org), [Three.js](http://github.com/mrdoob/three.js), or [Raphael.js](http://raphaeljs.com) for SVG.



* Examples of toxiclibs.js can be found at [http://haptic-data.com/toxiclibsjs](http://haptic-data.com/toxiclibsjs), and are included in the examples/ folder of the repository.
* Examples of the original library can be found at [http://toxiclibs.org](http://toxiclibs.org)


### A few examples ###
[![additive_waves](http://haptic-data.com/toxiclibsjs/img/additive_waves.jpg)](http://haptic-data.com/toxiclibsjs/examples/AdditiveWaves_pjs-webgl.html)
[![smooth_doodle](http://haptic-data.com/toxiclibsjs/img/smooth_doodle.gif)](http://haptic-data.com/toxiclibsjs/examples/SmoothDoodle_canvas.html)
[![polar_unravel](http://haptic-data.com/toxiclibsjs/img/polar_unravel.gif)](http://haptic-data.com/toxiclibsjs/examples/PolarUnravel_pjs.html)
[![circle_3_points](http://haptic-data.com/toxiclibsjs/img/circle_3_points.gif)](http://haptic-data.com/toxiclibsjs/examples/Circle3Points_pjs.html)
[![line2d_intersection](http://haptic-data.com/toxiclibsjs/img/line2d_intersection.gif)](http://haptic-data.com/toxiclibsjs/examples/Line2DIntersection_pjs.html)
[![attraction2d](http://haptic-data.com/toxiclibsjs/img/physics2d_attraction2d.gif)](http://haptic-data.com/toxiclibsjs/examples/Attraction2D_pjs.html)
[![draggable_particles](http://haptic-data.com/toxiclibsjs/img/physics2d_draggableparticles.gif)](http://haptic-data.com/toxiclibsjs/examples/DraggableParticles_pjs.html)
[![softbody_square](http://haptic-data.com/toxiclibsjs/img/physics2d_softbodysquare.gif)](http://haptic-data.com/toxiclibsjs/examples/SoftBodySquare_pjs.html)


#Getting Started with Toxiclibs.js

Toxiclibs.js can be used in the following ways:

*	As a single javascript file loaded into a webpage, with the contents of the entire library within a global *toxi* object.
*	As [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules that can be loaded independently or in packages, via [RequireJS](http://requirejs.org)
*	In [Node.js](http://nodejs.org) applications, as AMD modules that require the 'requirejs' library for Node.js.

To use as a single javascript file:

	//copy the file build/toxiclibs.js into your javascript folder
	<script type="text/javascript" src="js/toxiclibs.js"></script>
	<script type="text/javascript">
		var myVector = new toxi.geom.Vec2D(window.innerWidth,window.innerHeight).scaleSelf(0.5);
		var myColor = toxi.color.TColor.newRGB(128/255,64/255,32/255);
	</script>
To use with [RequireJS](http://requirejs.org):

	//copy the lib/ contents into your projects folder for loading modules
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

There are many different ways to use toxiclibs.js. Most of the [examples](http://haptic-data.com/toxiclibsjs/#examples) currently use [Processing.js](http://processingjs.org) and are created using the java-syntax style of the original [Processing](http://processing.org). This can be helpful to those that are making the transition from Java, but can be confusing to others. I will explain the basics of using toxiclibs.js and the few differences between it and [the original toxiclibs](http://toxiclibs.org). 

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





[http://haptic-data.com/toxiclibsjs](Toxiclibs.js) was initiated on 1/5/2011 by Kyle Phillips [http://haptic-data.com](http://haptic-data.com)



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