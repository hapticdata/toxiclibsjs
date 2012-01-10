define(["require", "exports", "module", "./Vec3D"], function(require, exports, module) {

var Vec3D = require('./Vec3D');

/**
 * @class
 * @member toxi
 */
var	IsectData3D = function(isec){
	if(isec !== undefined){
		this.isIntersection = isec.isIntersection;
		this.dist = isec.dist;
		this.pos = isec.pos.copy();
		this.dir = isec.dir.copy();
		this.normal = isec.normal.copy();
	}
	else {
		this.clear();
	}
};

IsectData3D.prototype = {
	clear: function(){
		this.isIntersection = false;
		this.dist = 0;
		this.pos = new Vec3D();
		this.dir = new Vec3D();
		this.normal = new Vec3D();
	},
	
	toString: function(){
		var s = "isec: "+this.isIntersection;
		if(this.isIntersection){
			s += " at:"+this.pos+ " dist:"+this.dist+" normal:"+this.normal;
		}
		return s;
	}
};

module.exports = IsectData3D;
});
