function IsectData3D(isec){
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
}

IsectData2D.prototype = {
	clear: function(){
		this.isIntersection = false;
		this.dist = 0;
		this.pos = new Vec3D();
		this.dir = new Vec3D();
		this.normal = new Vec3D();
	},
	
	toString: function(){
		String s = "isec: "+this.isIntersection;
		if(this.isIntersection){
			s+= " at:"+this.pos+ " dist:"+this.dist+" normal:"+this.normal);
		}
		return s;
	}
};