var JSHINT = require('jshint/jshint.js').JSHINT,
	fs = require('fs'),
	srcDir = "/../src/",
	files = {
		core: [
			'toxi.js',
			'core/math/MathUtils.js',
			'core/math/InterpolateStrategy.js',
			'core/math/ScaleMap.js',
			'core/math/Waves.js',
			'core/math/SinCosLUT.js',
			'core/geom/Vec2D.js',
			'core/geom/Vec3D.js',
			'core/geom/Vec2D_post.js',
			'core/geom/Polygon2D.js',
			'core/geom/BernsteinPolynomial.js',
			'core/geom/Spline2D.js',
			'core/geom/Ellipse.js',
			'core/geom/Rect.js',
			'core/geom/Circle.js',
			'core/geom/CircleIntersector.js',
			'core/geom/Cone.js',
			'core/geom/Line2D.js',
			'core/geom/Triangle.js',
			'core/geom/Triangle2D.js',
			'core/geom/IsectData2D.js',
			'core/geom/IsectData3D.js',
			'core/geom/Matrix4x4.js',
			'core/geom/Quaternion.js',
			'core/geom/mesh/Vertex.js',
			'core/geom/mesh/Face.js',
			'core/geom/mesh/Mesh3D.js',
			'core/geom/mesh/TriangleMesh.js',
			'core/geom/Sphere.js',
			'core/geom/mesh/VertexSelector.js',
			'core/geom/mesh/Selectors.js',
			'core/geom/mesh/SphereFunction.js',
			'core/geom/mesh/SphericalHarmonics.js',
			'core/geom/mesh/SuperEllipsoid.js',
			'core/geom/mesh/SurfaceMeshBuilder.js',
			'core/geom/AxisAlignedCylinder.js',
			'core/geom/AABB.js',
			'core/geom/mesh/BezierPatch.js',
			'core/geom/XAxisCylinder.js',
			'core/geom/YAxisCylinder.js',
			'core/geom/ZAxisCylinder.js',
			'core/geom/Line3D.js',
			'core/geom/Ray2D.js',
			'core/geom/Ray3D.js'
		],
		color: [
			'color/toxi-color.js',
			'color/TColor.js'
		],
		physics2d: [
			'physics/physics2d/physics2d.js',
			'physics/physics2d/VerletParticle2D.js',
			'physics/physics2d/VerletSpring2D.js',
			'physics/physics2d/behaviors/AttractionBehavior.js',
			'physics/physics2d/behaviors/ConstantForceBehavior.js',
			'physics/physics2d/behaviors/GravityBehavior.js',
			'physics/physics2d/constraints/AngularConstraint.js',
			'physics/physics2d/constraints/AxisConstraint.js',
			'physics/physics2d/constraints/CircularConstraint.js',
			'physics/physics2d/constraints/MaxConstraint.js',
			'physics/physics2d/constraints/MinConstraint.js',
			'physics/physics2d/constraints/RectConstraint.js',
			'physics/physics2d/ParticlePath2D.js',
			'physics/physics2d/ParticleString2D.js',
			'physics/physics2d/PullBackString2D.js',
			'physics/physics2d/VerletConstrainedSpring2D.js',
			'physics/physics2d/VerletMinDistanceSpring2D.js',
			'physics/physics2d/VerletPhysics2D.js'
		]
	},
	filesToTest = [],
	showMixedSpacesAndTabs = false;
	

if(process.argv.length < 3){ //it was just 'node' passed in, do them all
	for(var prop in files){
		filesToTest = filesToTest.concat(files[prop]);
	}
} else {
	
	process.argv.forEach(function (val, index, array) {
		console.log(val);
		if(val.indexOf("file") > -1){
			console.log("test one file");
			var file = val.slice('file='.length);
			console.log("test: "+file);
			filesToTest = [file];
		}
		if(val == 'showMixedSpacesAndTabs'){
			showMixedSpacesAndTabs = true;
		} else {
	  		if(files[val] !== undefined){
	  			console.log(files[val]);
	  			filesToTest = filesToTest.concat(files[val]);
	  		}
  		}
	});
}


var logError = function(er){
	console.log("-------");
	console.log(file);
	console.log("line " +er.line + " character " + er.character + ", "+er.id + ": "+er.reason);
	console.log(er.evidence);
}


console.log(filesToTest.length);
for(var i=0;i<filesToTest.length;i++){
	var file = filesToTest[i];
	var src = fs.readFileSync(__dirname + srcDir + file, 'utf8'),
		result = JSHINT(src,{white: false}),
		mixedSpacesTabs = [],
		j = 0;
	if(!result){
		for(j=0;j<JSHINT.errors.length;j++){
			var er = JSHINT.errors[j];
			if(er.reason == 'Mixed spaces and tabs.'){
				mixedSpacesTabs.push(er);
			} else {
				logError(er);
			}
		}
		console.log("TOTAL ERRORS: "+JSHINT.errors.length);
		console.log("Total 'Mixed spaces and tabs.' Errors: "+mixedSpacesTabs.length);
		if(showMixedSpacesAndTabs){
			for(j = 0;j<mixedSpacesTabs.length;j++){
				logError(mixedSpacesTabs[j]);
			}
		}
		console.log("--------------------------");
		console.log("--------------------------");
		break;
	}
}




/*
 * Takes a list of files and runs them through JSHint
 *
 * Usage:
 *      check.js file1 file2 file3
 */
/*
var fs = require('fs'),
    jshint = require('jshint/jshint.js').JSHINT,
    files = ['../build/toxiclibs-core-debug.js']; 

// Get list of files
process.argv.forEach(function(val, index, array) {
    files.push(val);
});

console.log('-----------------------------------------');
var processFile = function(err, data) {
        if(err) {
            console.log('Error: ' + err);
            return;
        }   

        if(jshint(data.toString())) {
            console.log('File ' + files[i] + ' has no errors.  Congrats!');
        } else {
            console.log('Errors in file ' + files[i]);
            console.log('');
            var out = jshint.data(),
                errors = out.errors;

            for(var j=0;j<errors.length;j++) {
                console.log(errors[j].line + ':' + errors[j].character + ' -> ' + errors[j].reason + ' -> ' + errors[j].evidence);
            }   

            // List globals
            console.log('');
            console.log('Globals: ');
            for(j=0;j<out.globals.length;j++) {
                console.log('    ' + out.globals[j]);
            }   
        }   
        console.log('-----------------------------------------');
};
for(var i=2;i<files.length;i++) {
    fs.readFile(files[i], processFile); 
}*/
