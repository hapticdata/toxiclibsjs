#Getting Started with Toxiclibs.js

Toxiclibs.js can be used in the following ways:

*	As a single javascript file loaded into a webpage, with the contents of the entire library within a global *toxi* object.
*	As [CommonJS](http://www.commonjs.org/) modules for use with [Node.js](http://nodejs.org) and can be loaded via [NPM](http://npmjs.org/)
*	As [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) modules that can be loaded via [RequireJS](http://requirejs.org)

There are many different ways to use toxiclibs.js. Most of the [examples on this site](http://haptic-data.com/toxiclibsjs) currently use [Processing.js](http://processingjs.org) and are created using the common java-syntax style of the original [Processing](http://processing.org). This can be helpful to those that are making that transition, but can be confusing to others. I will explain the basics of using toxiclibs.js and the few differences between it and [the original toxiclibs](http://toxiclibs.org). 

For comprehensive documentation, read the original libraries [javadocs](http://toxiclibs.org/javadocs/). As the library is still growing, you can compare that documentation to this list of implemented classes.


## Toxiclibs.js now follows the toxiclibs package structure
The following objects are returned when loading the entire library

* **color** - the color utils package
* **geom** - the geometry utils package
* *internals* - functionality used within the library, such as extend()
* **math** - the math utils package
* **physics2d** - the Verlet Physics 2D package
* **utils** - the utils package

Below is an example using Node.js:

	var toxi = require('toxiclibs');				
	//Circle and Vec2D are both members of the core
	//first parameter is a vector for the location, second parameter is the radius
	var circle = new toxi.geom.Circle( new toxi.geom.Vec2D(200,100), 50);

	//VerletPhysics2D is a member of the physics2d library
	var physics = new toxi.physics2d.VerletPhysics2D();

	//Using a 'static' from TColor, a member of the color library
	var color = toxi.color.TColor.newRGB(0.25,0.5,0.75);


#Arrays / Collections

The Java version frequently uses [Collections](http://docs.oracle.com/javase/tutorial/collections/), [Iterators](http://docs.oracle.com/javase/1.4.2/docs/api/java/util/Iterator.html), and [java-specific for-loops](http://stackoverflow.com/questions/8681593/does-javascript-have-an-enhanced-for-loop-syntax-similar-to-javas)[[2]](http://blogs.oracle.com/sundararajan/entry/java_javascript_and_jython). In toxiclibs.js you will see a standard JavaScript usage of arrays. Below is an example of accessing the faces from a TriangleMesh:

	var faces = mesh.faces,
		len = faces.length,
		i = 0;
	for(i = 0; i < len; i++){
		var face = faces[i];
	}

This section will occassionally be expanded on. If you have a suggestion, or have a question on how something works, feel free to [leave an issue](https://github.com/hapticdata/toxiclibsjs/issues) and I am quick to respond.