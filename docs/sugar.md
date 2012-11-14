#Additional features in Toxiclib.js
Toxiclibs.js' top priority is to match the API and functionality of the original library. With that in mind features specific to this javascript version have been added for convenience and to be more idiomatic. Below are some examples.

##No `instanceof` tests
**Toxiclibs.js never uses `instanceof` tests**, instead it relies on property and method detection, this allows for work between iframes, and work between libraries. For example, the example below works:

	var vec, threeVector3 = new THREE.Vector3( 10, 15, 20 );
	vec = toxi.geom.Vec3D.randomVector().addSelf( threeVector3 ); // or
	vec = new toxi.geom.Vec3D( threeVector3 );

##toxi.geom.mesh.OBJWriter#getOutput()
Because file system access is complicated on the web, `getOutput()` has been added to the `OBJWriter` object to get the contents of an .obj file back as a string:

	var obj = new toxi.geom.mesh.OBJWriter();
	mesh.saveAsOBJ( obj );
	objContents = obj.getOutput();

##toxi.color.TColor
Several features have been added to `TColor` to improve interoperability with the browser. Including full integration of CSS colors.
###TColor.X11
Color values for [every color name in X11](http://en.wikipedia.org/wiki/Web_colors), as used in CSS:
	
	toxi.color.TColor.X11.aquamarine.toRGBAArray() //[ 0.4980392156862745, 1, 0.8313725490196079, 1 ]
	toxi.color.TColor.X11.indianred.toRGBCSS() // 'rgb(205,92,92)'
###TColor.newCSS
Accepts any CSS color value, including _hexadecimal, 'rgba()','rgb()','hsl()','hsla()' or any X11 color name_ and creates a TColor object.
	
	var color;
	color = toxi.color.TColor.newCSS( 'pinksalmon' ); //or
	color = toxi.color.TColor.newCSS( 'rgba( 128, 255, 32, 0.75)' ); //or
	color = toxi.color.TColor.newCSS( '#ff00ac' );
and so on… ultimately this gets you a safe method of using any dom elements css properties:

	color = toxi.color.TColor.newCSS( $('body').css('background-color') );

###toCSSRGBA(), toCSSRGB(), toCSSHSLA(), toCSSHSL(), toCSSHex()
convert your color into a string suitable for CSS
		
	var color = toxi.color.TColor.newRGB( 0.75, 0.5, 0.25 );
	color.toRGBACSS() // "rgba(191,127,63,1)"
	color.toRGBCSS() // "rgb(191,127,63)"

###toInt()
convert the `TColor` into an integer, I have found this particularly useful in three.js
	
	toxi.color.TColor.newHex("ff00ff").toInt() //16711935


##toxi.geom.Vec2D & toxi.geom.Vec3D
All functions work with any objects that have `x`,`y` and in Vec3D `z` properties.

	var vec = new toxi.geom.Vec2D({ x: 0.5, y: 0.25 });

##toxi.geom.Rect
Constructor function has been overloaded to accept a parameter object:

	var rect = new toxi.geom.Rect({ x: 10, y: 10, width: 100, height: 50 });

##toxi.geom.Spline2D
Constructor function has been overloaded to accept a parameter object:

	var spline = new toxi.geom.Spline2D({ points: myPointsArray, tightness: 0.1 });

##toxi.math.ScaleMap
Constructor function has been overloaded to accept a parameter object:

	var map = new toxi.math.ScaleMap({
		input: { min: 0, max: 100 },
		output: { min: -1, max: 1}
	});

##toxi.geom.Sphere#toMesh()
`toMesh()` accepts a parameter object:

	sphere.toMesh({
		mesh: new toxi.geom.mesh.TriangleMesh('sphere'),
		resolution: 20
	});

##toxi.geom.XAxisAlignedCylinder#toMesh() (as well as Y and Z cylinders)
`toMesh()` accepts a parameter object:

	cylinder.toMesh({
		mesh: new toxi.geom.mesh.TriangleMesh('cylinder'),
		steps: 12,
		thetaOffset: Math.PI/6
	});

##toxi.geom.Cone
constructor supports parameter object:

	cone = new toxi.geom.Cone({
		position: new toxi.geom.Vec3D(),
		direction: new toxi.geom.Vec3D(1,0,0),
		radiusNorth: 4,
		radiusSouth: 3,
		length: 8
	});

###toMesh()
`toMesh()` accepts a parameter object:

	cone.toMesh({
		mesh: new toxi.geom.mesh.TriangleMesh('cone'),
		steps: 10,
		thetaOffset: Math.PI/4,
		topClosed: false,
		bottomClosed: true
	});

