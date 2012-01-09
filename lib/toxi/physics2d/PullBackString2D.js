define(["require", "exports", "module", "../internals","./VerletSpring2D"], function(require, exports, module) {

var internals = require('../internals'),
	VerletSpring2D = require('./VerletSpring2D');

/**
* Creates a pullback spring (default restlength=0.5) between 2 particles and
* locks the first one given at the current position. The spring is only
* enforced if the current length of the spring exceeds the rest length. This
* behaviour is the opposite to the {@link VerletMinDistanceSpring2D}.
*/
 
 var PullBackString2D = function(a,b,strength){
	VerletSpring2D.apply(this,[a,b,0,strength]);
	a.lock();
	this.setRestLength(0.5);
 };
 internals.extend(PullBackString2D,VerletSpring2D);

 PullBackString2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) > this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
 };

 module.exports = PullBackString2D;
});
