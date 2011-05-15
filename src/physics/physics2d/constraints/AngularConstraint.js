toxi.physics2d.AngularConstraint = function(theta_p,theta){

	if(arguments.length > 1){
		var p = theta_p;
		this.theta = theta;
		this.rootPos = new toxi.Vec2D(p);
	} else {
		this.rootPos = new toxi.Vec2D();
		this.theta = theta_p;
	}
	if(parseInt(this.theta) != this.theta){
		this.theta = MathUtils.radians(this.theta);
	}
};


toxi.physics2d.AngularConstraint.prototype.apply = function(p){
	var delta = p.sub(this.rootPos);
	var heading = MathUtils.floor(delta.heading() / this.theta) * this.theta;
	p.set(this.rootPos.add(toxi.Vec2D.fromTheta(heading).scaleSelf(delta.magnitude())));
};