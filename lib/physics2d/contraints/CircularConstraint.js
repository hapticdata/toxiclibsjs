toxi.physics2d.CircularConstraint = function(a,b){
	if(arguments.length == 1){
		this.circle = a;
	} else {
		console.log("a: "+a);
		this.circle = new toxi.Circle(a,b);
	}
};

toxi.physics2d.CircularConstraint.prototype.applyConstraint = function(p){
	if(this.circle.containsPoint(p)){
		p.set(this.circle.add(p.sub(this.circle).normalizeTo(this.circle.getRadius())));
	}
};