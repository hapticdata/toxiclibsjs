#Using Toxiclibs.js w/ RequireJS

With [RequireJS](http://requirejs.org) you can avoid placing any toxiclibsjs objects in the global scope. It allows you to optimize script loading, and you will only load the code that you are using instead of the entire library. To use toxiclibsjs with RequireJS use the files provided in the [toxiclibsjs/build/requirejs](http://github.com/hapticdata/toxiclibsjs/build/requirejs) directory. Below is an example of how you would use toxiclibsjs within RequireJS:

	/*
	 RequireJS' define() method accepts an array of dependencies, 
	 then a function to execute once the dependencies have been loaded
	 */
	define([
		'toxi/geom/Vec2D',
		'toxi/geom/Circle',
		'toxi/color/TColor',
		'toxi/math/mathUtils'
	], function(Vec2D, Circle, TColor, mathUtils){
		
		var canvas = document.getElementById('sketch'),
			ctx = canvas.getContext('2d');

		//use Vec2D to create a vector in the middle of the canvas
		var center = new Vec2D(canvas.width,canvas.height).scaleSelf(0.5),
			myCircle = new Circle(center, 100),
			myColor = TColor.newHSV(0.5,1.0,1.0);


		//draw the circle with our color
		ctx.StrokeStyle = myColor.toRGBACSS();
		ctx.beginPath();
		ctx.arc(myCircle.x,myCircle.y,myCircle.getRadius(),0,mathUtils.TWO_PI);
		ctx.closePath();
		ctx.stroke();
	});