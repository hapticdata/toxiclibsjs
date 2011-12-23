
var lib = require('../../libUtils'),
	ConstantForceBehavior = require('./ConstantForceBehavior');

var	GravityBehavior = function(gravityVec){
	ConstantForceBehavior.apply(this,[gravityVec]);
};

lib.extend(GravityBehavior,ConstantForceBehavior);

GravityBehavior.prototype.configure = function(timeStep){
	this.timeStep = timeStep;
    this.scaledForce = this.force.scale(timeStep * timeStep);
};

module.exports = GravityBehavior;