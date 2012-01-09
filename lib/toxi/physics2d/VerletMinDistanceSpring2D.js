define(["require", "exports", "module", "../internals","./VerletSpring2D"], function(require, exports, module) {

var internals = require('../internals'),
	VerletSpring2D = require('./VerletSpring2D');

var	VerletMinDistanceSpring2D = function(particleA,particleB,len,str){
	VerletSpring2D.call(this,particleA,particleB,len,str);
	this.setRestLength(len);
};

internals.extend(VerletMinDistanceSpring2D,VerletSpring2D);

VerletMinDistanceSpring2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) < this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
};

module.exports = VerletMinDistanceSpring2D;
});
