//either Vec2D + angle
toxi.physics2d.AngularConstraint = function(theta_p,theta){

	if(arguments.length > 1){
		var p = theta_p;
		this.theta = theta;
		this.rootPos = new toxi.Vec2D(p);
	} else {
		this.rootPos = new toxi.Vec2D();
		this.theta = theta_p;
	}
	if(parseInt(this.theta,10) != this.theta){
		this.theta = toxi.MathUtils.radians(this.theta);
	}
};


toxi.physics2d.AngularConstraint.prototype.applyConstraint = function(p){
	var delta = p.sub(this.rootPos);
	var heading = toxi.MathUtils.floor(delta.heading() / this.theta) * this.theta;
	p.set(this.rootPos.add(toxi.Vec2D.fromTheta(heading).scaleSelf(delta.magnitude())));
};