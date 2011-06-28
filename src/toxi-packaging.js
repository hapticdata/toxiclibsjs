(function(){
	var packages = {
		"geom" : [
			"AABB",
			"AxisAlignedCylinder",
			"BernsteinPolynomial",
			"Circle",
			"CircleIntersector",
			"Cone",
			"Ellipse",
			"IsectData2D",
			"IsectData3D",
			"Line2D",
			"Line3D",
			"Matrix4x4",
			"Polygon2D",
			"Quaternion",
			"Ray2D",
			"Ray3D",
			"Ray3DIntersector",
			"Rect",
			"Sphere",
			"Spline2D",
			"Triangle",
			"Vec2D",
			"Vec3D",
			"XAxisCylinder",
			"YAxisCylinder",
			"ZAxisCylinder"
		],
		"geom.mesh" : [
			
			//mesh
			"BezierPath",
			"Face",
			"Selector",
			"SphereFunction",
			"SphericalHarmonics",
			"SuperEllipsoid",
			"SurfaceMeshBuilder",
			"TriangleMesh",
			"Vertex",
			"VertexSelector"
		],
		
		"math" : [
			
			//math
			"MathUtils",
			"SigmoidInterpolation",
			"BezierInterpolation",
			"CircularInterpolation",
			"CosineInterpolation",
			"DecimatedInterpolation",
			"LinearInterpolation",
			"ExponentialInterpolation",
			"Interpolation2D",
			"ThresholdInterpolation",
			"ZoomLensInterpolation",
			"ScaleMap",
			"SinCosLUT",
		],
		
		"math.waves" : [
			"AbstractWave",
			"SineWave",
			"AMFMSineWave",
			"ConstantWave",
			"FMHarmonicSquareWave",
			"FMSawtoothWave",
			"FMSineWave",
			"FMSquareWave",
			"FMTriangleWave"
		]
	};
	
	
	toxi.package = function(){
		var getPackageObject = function(o,packageString){
			var split = packageString.split('.');
			var returnObject = undefined;
			if(split.length < 2){
				returnObject = {object: o, package: split[0]};
			} else if(split.length > 1){
				o[split[0]] = o[split[0]] || {};
				returnObject = {object: o[split[0]], package: split[1]};
			}
			
			if(split.length > 2){
				var nextString = packageString.slice(split[0].length+1);
				returnObject = getPackageObject(o[split[0]],nextString);
			} 
			return returnObject;
		};
		for(var p in packages){
			var packageObj = getPackageObject(this,p);
			var toxiPackage = packageObj.object;
			var id = packageObj.package;
			var classes = packages[p];
			var o = {};
			for(var i=0,len=classes.length;i<len;i++){
				o[classes[i]] = toxi[classes[i]];
			}
			toxiPackage[id] = o;
		}
	};

	toxi.globalize = function() {
		for(var p in packages){
			var classes = packages[p];
			for(var i=0,len=classes.length;i<len;i++){
				window[classes[i]] = toxi[classes[i]];
			}
		}
	};
	
})();