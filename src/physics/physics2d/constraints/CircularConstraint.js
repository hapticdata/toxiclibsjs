toxi.physics2d.CircularConstraint = function(a,b){
	if(arguments.length == 1){
		this.circle = a;
	} else {
		this.circle = new toxi.Circle(a,b);
	}
};

toxi.physics2d.CircularConstraint.prototype.apply = function(p){
	if(this.circle.containsPoint(p)){
		p.set(this.circle.add(p.sub(this.circle).nomalizeTo(this.circle.getRadius())));
	}
};