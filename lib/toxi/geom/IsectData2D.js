define(["require", "exports", "module", "./Vec2D"], function(require, exports, module) {

var Vec2D = require('./Vec2D');

/**
 * @class
 * @member toxi
 */
var	IsectData2D = function(isec){
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

IsectData2D.prototype = {
	clear: function(){
		this.isIntersection = false;
		this.dist = 0;
		this.pos = new Vec2D();
		this.dir = new Vec2D();
		this.normal = new Vec2D();
	},
	
	toString: function(){
		var s = "isec: "+this.isIntersection;
		if(this.isIntersection){
			s+= " at:"+this.pos+ " dist:"+this.dist+" normal:"+this.normal;
		}
		return s;
	}
};

module.exports = IsectData2D;
});
