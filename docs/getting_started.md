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
