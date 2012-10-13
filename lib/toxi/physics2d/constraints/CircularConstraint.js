define(["require", "exports", "module", "../../geom/Circle"], function(require, exports, module) {
	var Circle = require('../../geom/Circle');
	
	var	CircularConstraint = function(a,b){
		if(arguments.length == 1){
			this.circle = a;
		} else {
			this.circle = new Circle(a,b);
		}
	};

	CircularConstraint.prototype.applyConstraint = function(p){
		if(this.circle.containsPoint(p)){
			p.set(this.circle.add(p.sub(this.circle).normalizeTo(this.circle.getRadius())));
		}
	};

	module.exports = CircularConstraint;
});
