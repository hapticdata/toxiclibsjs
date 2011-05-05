toxi.physics2d.VerletMinDistanceSpring2D = function(particleA,particleB,len,str){
	this.initVerletSpring2D(particleA,particleB,len,str);
	this.setRestLength(len);
};


toxi.extend(toxi.physics2d.VerletMinDistanceSpring2D,toxi.physics2d.VerletSpring2D);

toxi.physics2d.VerletMinDistanceSpring2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) < this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
};