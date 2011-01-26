function SuperEllipsoid(n1,n2) {
    this.p1 = n1;
	this.p2 = n2;
}

SuperEllipsoid.prototype = {
    computeVertexFor: function(p,phi,theta) {
        phi -= MathUtils.HALF_PI;
        var cosPhi = MathUtils.cos(phi),
        	cosTheta = MathUtils.cos(theta),
        	sinPhi = MathUtils.sin(phi),
        	sinTheta = MathUtils.sin(theta);

        var t = MathUtils.sign(cosPhi) * Math.pow(MathUtils.abs(cosPhi), this.p1);
        p.x = t * MathUtils.sign(cosTheta) * Math.pow(Math.abs(cosTheta), this.p2);
        p.y = MathUtils.sign(sinPhi) * Math.pow(Math.abs(sinPhi), this.p1);
        p.z = t * MathUtils.sign(sinTheta) * Math.pow(MathUtils.abs(sinTheta), this.p2);
        return p;
    },
 
 	getPhiRange: function() {
        return MathUtils.TWO_PI;
    },

	getPhiResolutionLimit: function(res) {
        return res / 2;
    },

	getThetaRange: function() {
        return MathUtils.TWO_PI;
    },

	getThetaResolutionLimit: function(res) {
        return res;
    }
};