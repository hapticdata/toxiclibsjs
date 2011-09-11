toxi.SuperEllipsoid = function(n1,n2) {
	this.p1 = n1;
	this.p2 = n2;
};

toxi.SuperEllipsoid.prototype = {
	computeVertexFor: function(p,phi,theta) {
		phi -= toxi.MathUtils.HALF_PI;
		var cosPhi = toxi.MathUtils.cos(phi),
			cosTheta = toxi.MathUtils.cos(theta),
			sinPhi = toxi.MathUtils.sin(phi),
			sinTheta = toxi.MathUtils.sin(theta);

		var t = toxi.MathUtils.sign(cosPhi) * Math.pow(toxi.MathUtils.abs(cosPhi), this.p1);
		p.x = t * toxi.MathUtils.sign(cosTheta) * Math.pow(Math.abs(cosTheta), this.p2);
		p.y = toxi.MathUtils.sign(sinPhi) * Math.pow(Math.abs(sinPhi), this.p1);
		p.z = t * toxi.MathUtils.sign(sinTheta) * Math.pow(toxi.MathUtils.abs(sinTheta), this.p2);
		return p;
	},
 
	getPhiRange: function() {
		return toxi.MathUtils.TWO_PI;
	},

	getPhiResolutionLimit: function(res) {
		return res / 2;
	},

	getThetaRange: function() {
		return toxi.MathUtils.TWO_PI;
	},

	getThetaResolutionLimit: function(res) {
		return res;
	}
};