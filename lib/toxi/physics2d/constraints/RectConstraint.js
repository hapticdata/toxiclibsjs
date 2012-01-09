define(["require", "exports", "module"], function(require, exports, module) {
var	RectConstraint = function(a,b){
	if(arguments.length == 1){
		this.rect = a.copy();
	} else if(arguments.length > 1){
		this.rect = new toxi.Rect(a,b);
	}
	this.intersectRay = new toxi.Ray2D(this.rect.getCentroid(), new toxi.Vec2D());
};

RectConstraint.prototype = {
	applyConstraint: function(p){
		if(this.rect.containsPoint(p)){
			p.set(this.rect.intersectsRay(this.intersectRay.setDirection(this.intersectRay.sub(p)),0,Number.MAX_VALUE));
		}
	},
	
	getBox: function(){
		return this.rect.copy();
	},
	
	setBox: function(rect){
		this.rect = rect.copy();
		this.intersectRay.set(this.rect.getCentroid());
	}	
};

module.exports = RectConstraint;
});
