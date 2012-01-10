define(["require", "exports", "module", "../internals","../geom/Spline2D"], function(require, exports, module) {

var internals = require('../internals'),
	Spline2D = require('../geom/Spline2D');

var	ParticlePath2D = function(points){
	toxi.Spline2D.call(this,points);
	this.particles = [];
};

internals.extend(ParticlePath2D,Spline2D);


//protected
var _createSingleParticle = function(pos,mass){
	return new VerletParticle2D(pos,mass);
};

//public
ParticlePath2D.prototype.createParticles = function(physics,subDiv,step,mass){
	this.particles = [];
	this.computeVertices(subDiv);
	var i = 0;
	var dv = this.getDecimatedVertices(step,true);
	for(i = 0; i < dv; i++){
		var p = _createSingleParticle(v,mass);
		this.particles.push(p);
		physics.addParticle(p);
	}
	return this.particles;
};

module.exports = ParticlePath2D;
});
