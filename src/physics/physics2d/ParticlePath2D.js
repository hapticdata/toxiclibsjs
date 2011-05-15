toxi.physics2d.ParticlePath2D = function(points){
	toxi.Spline2D.call(this,points);
	this.particles = [];
};
toxi.extend(toxi.physics2d.ParticlePath2D,toxi.Spline2D);

(function(){
	//protected
	var createSingleParticle = function(pos,mass){
		return new toxi.physics2d.VerletParticle2D(pos,mass);
	};
	
	//public
	toxi.physics2d.ParticlePath2D.prototype.createParticles = function(physics,subDiv,step,mass){
		this.particles = [];
		this.computeVertices(subDiv);
		var i = 0;
		var dv = this.getDecimatedVertices(step,true);
		for(i = 0; i < dv; i++){
			var p = this.createSingleParticle(v,mass);
			this.particles.push(p);
			physics.addParticle(p);
		}
		return this.particles;
	};


})();