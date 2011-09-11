/**
* Creates a pullback spring (default restlength=0.5) between 2 particles and
* locks the first one given at the current position. The spring is only
* enforced if the current length of the spring exceeds the rest length. This
* behaviour is the opposite to the {@link VerletMinDistanceSpring2D}.
*/
 
 toxi.physics2d.PullBackString2D = function(a,b,strength){
	toxi.physics2d.VerletSpring2D.apply(this,[a,b,0,strength]);
	a.lock();
	this.setRestLength(0.5);
 };
 toxi.extend(toxi.physics2d.PullBackString2D,toxi.physics2d.VerletSpring2D);

 toxi.physics2d.PullBackString2D.prototype.update = function(applyConstraints){
	if(this.b.distanceToSquared(this.a) > this.restLengthSquared){
		this.parent.update.call(this,applyConstraints);
	}
 };