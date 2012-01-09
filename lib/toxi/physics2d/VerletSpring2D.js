define(["require", "exports", "module"], function(require, exports, module) {
var	VerletSpring2D = function(a,b,len,str){
	this.a = a;
	this.b = b;
	this.restLength = len;
	this.strength = str;
};

VerletSpring2D.EPS = 1e-6;

VerletSpring2D.prototype = {
	getRestLength: function(){
		return this.restLength;
	},
	
	getStrength: function(){
		return this.strength;
	},
	
	lockA: function(s){
		this.isALocked = s;
		return this;
	},
	
	lockB: function(s){
		this.isALocked = s;
		return this;
	},
	
	setRestLength: function(len){
		this.restLength = len;
		this.restLengthSquared = len * len;
		return this;
	},
	
	setStrength: function(strength){
		this.strength = strength;
		return this;
	},
	
	update: function(applyConstraints){ //protected
		var delta = this.b.sub(this.a);
		//add minute offset to avoid div-by-zero errors
		var dist = delta.magnitude() + VerletSpring2D.EPS;
		var normDistStrength = (dist - this.restLength) / (dist * (this.a.invWeight + this.b.invWeight)) * this.strength;
		if(!this.a.isLocked && !this.isALocked){
			this.a.addSelf(
				delta.scale(normDistStrength * this.a.invWeight)
			);
			if(applyConstraints){
				this.a.applyConstraints();
			}
		}
		if(!this.b.isLocked && !this.isBLocked){
			this.b.addSelf(
				delta.scale(-normDistStrength * this.b.invWeight)
			);
			if(applyConstraints){
				this.b.applyConstraints();
			}
		}
	}
};

module.exports = VerletSpring2D;
});
