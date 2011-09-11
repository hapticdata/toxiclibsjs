/**
 * This implementation of a {@link SurfaceFunction} samples a given
 * {@link Sphere} instance when called by the {@link SurfaceMeshBuilder}.
 */

toxi.SphereFunction = function(sphere_or_radius) {
	if(sphere_or_radius === undefined){
		this.sphere = new toxi.Sphere(new toxi.Vec3D(),1);
	}
	if(sphere_or_radius instanceof toxi.Sphere){
		this.sphere = sphere_or_radius;
	}
	else{
		this.sphere = new toxi.Sphere(new toxi.Vec3D(),sphere_or_radius);
	}
	this.phiRange = toxi.MathUtils.PI;
	this.thetaRange = toxi.MathUtils.TWO_PI;
};

toxi.SphereFunction.prototype = {
	
	computeVertexFor: function(p,phi,theta) {
	    phi -= toxi.MathUtils.HALF_PI;
	    var cosPhi = toxi.MathUtils.cos(phi);
	    var cosTheta = toxi.MathUtils.cos(theta);
	    var sinPhi = toxi.MathUtils.sin(phi);
	    var sinTheta = toxi.MathUtils.sin(theta);
	    var t = toxi.MathUtils.sign(cosPhi) * toxi.MathUtils.abs(cosPhi);
	    p.x = t * toxi.MathUtils.sign(cosTheta) * toxi.MathUtils.abs(cosTheta);
	    p.y = toxi.MathUtils.sign(sinPhi) * toxi.MathUtils.abs(sinPhi);
	    p.z = t * toxi.MathUtils.sign(sinTheta) * toxi.MathUtils.abs(sinTheta);
	    return p.scaleSelf(this.sphere.radius).addSelf(this.sphere);
	},
	
	getPhiRange: function() {
	    return this.phiRange;
	},
	
	getPhiResolutionLimit: function(res) {
	    return res;
	},
	
	getThetaRange: function() {
	    return this.thetaRange;
	},
	
	getThetaResolutionLimit: function(res) {
	    return res;
	},
	
	setMaxPhi: function(max) {
	    this.phiRange = toxi.MathUtils.min(max / 2, toxi.MathUtils.PI);
	},
	
	setMaxTheta: function(max) {
	    this.thetaRange = toxi.MathUtils.min(max, toxi.MathUtils.TWO_PI);
	}
};