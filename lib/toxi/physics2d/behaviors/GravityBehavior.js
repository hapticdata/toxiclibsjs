define(function(require, exports, module) {

var internals = require('../../internals'),
	ConstantForceBehavior = require('./ConstantForceBehavior');

var	GravityBehavior = function(gravityVec){
	ConstantForceBehavior.call(this,gravityVec);
};

internals.extend(GravityBehavior,ConstantForceBehavior);

GravityBehavior.prototype.configure = function(timeStep){
	this.timeStep = timeStep;
    this.scaledForce = this.force.scale(timeStep * timeStep);
};

module.exports = GravityBehavior;
});
