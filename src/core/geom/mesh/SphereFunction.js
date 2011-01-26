/**
 * This implementation of a {@link SurfaceFunction} samples a given
 * {@link Sphere} instance when called by the {@link SurfaceMeshBuilder}.
 */

function SphereFunction(sphere_or_radius) {
	if(sphere_or_radius === undefined){
		this.sphere = new Sphere(new Vec3D(),1);
	}
	if(sphere_or_radius instanceof Sphere){
		this.sphere = sphere_or_radius;
	}
	else{
		this.sphere = new Sphere(new Vec3D(),sphere_or_radius);
	}
	this.phiRange = MathUtils.PI;
	this.thetaRange = MathUtils.TWO_PI;
}

SphereFunction.prototype = {
	
	computeVertexFor: function(p,phi,theta) {
	    phi -= MathUtils.HALF_PI;
	    var cosPhi = MathUtils.cos(phi);
	    var cosTheta = MathUtils.cos(theta);
	    var sinPhi = MathUtils.sin(phi);
	    var sinTheta = MathUtils.sin(theta);
	    var t = MathUtils.sign(cosPhi) * MathUtils.abs(cosPhi);
	    p.x = t * MathUtils.sign(cosTheta) * MathUtils.abs(cosTheta);
	    p.y = MathUtils.sign(sinPhi) * MathUtils.abs(sinPhi);
	    p.z = t * MathUtils.sign(sinTheta) * MathUtils.abs(sinTheta);
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
	    this.phiRange = MathUtils.min(max / 2, MathUtils.PI);
	},
	
	setMaxTheta: function(max) {
	    this.thetaRange = MathUtils.min(max, MathUtils.TWO_PI);
	}
};