define(["require", "exports", "module", "../../internals","./ConstantForceBehavior"], function(require, exports, module) {

var lib = require('../../internals'),
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
});
