define(["require", "exports", "module", "../../math/mathUtils","../../geom/Vec2D"], function(require, exports, module) {

var mathUtils = require('../../math/mathUtils'),
	Vec2D = require('../../geom/Vec2D');

//either Vec2D + angle
/**
 * @param {Vec2D | Number} vector | angle
 * @param {Number} [theta]
 */
var	AngularConstraint = function(theta_p,theta){

	if(arguments.length > 1){
		var p = theta_p;
		this.theta = theta;
		this.rootPos = new Vec2D(p);
	} else {
		this.rootPos = new Vec2D();
		this.theta = theta_p;
	}
	if(parseInt(this.theta,10) != this.theta){
		this.theta = mathUtils.radians(this.theta);
	}
};


AngularConstraint.prototype.applyConstraint = function(p){
	var delta = p.sub(this.rootPos);
	var heading = toxi.MathUtils.floor(delta.heading() / this.theta) * this.theta;
	p.set(this.rootPos.add(toxi.Vec2D.fromTheta(heading).scaleSelf(delta.magnitude())));
};

module.exports = AngularConstraint;
});
