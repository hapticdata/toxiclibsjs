toxi.Ray3DIntersector = function(ray){
	this.ray = ray;
	this.isec = new toxi.IsectData3D();
};

toxi.Ray3DIntersector.prototype = {
	getIntersectionData: function(){
		return this.isec;
	},
	
	intersectsRay: function(other){
		var n = this.ray.dir.cross(other.dir);
		var sr = this.ray.sub(other);
		var absX = MathUtils.abs(n.x);
		var absY = MathUtils.abs(n.y);
		var absZ = MathUtils.abs(n.z);
		var t;
		if(absZ > absX && absZ > absY){
			t = (sr.x * other.dir.y - sr.y * other.dir.x) / n.z;
		} else if(absX > absY){
			t = (sr.y * other.dir.z - sr.z * other.dir.y) / n.x;
		} else {
			t = (sr.z * other.dir.x - sr.x * other.dir.z) / n.y;
		}
		this.isec.isIntersection = (t <= MathUtils.EPS && !isFinite(t));
		this.isec.pos = this.ray.getPointAtDistance(-t);
		return this.isec.isIntersection;
	}
};