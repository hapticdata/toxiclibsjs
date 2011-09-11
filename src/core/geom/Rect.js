toxi.Rect = function(a,b,width,height){
	if(arguments.length === 2){ //then it should've been 2 Vec2D's
		if(!(a instanceof toxi.Vec2D)){
			throw new Error("toxi.Rect received incorrect parameters");
		} else {
			this.x = a.x;
			this.y = a.y;
			this.width = b.x - this.x;
			this.height = b.y - this.y;
		}
	} else if(arguments.length === 4){
		this.x = a;
		this.y = b;
		this.width = width;
		this.height = height;
	} else if(arguments.length > 0){
		throw new Error("toxi.Rect received incorrect parameters");
	}
};

toxi.Rect.fromCenterExtent = function(center,extent){
	return new toxi.Rect(center.sub(extent),center.add(extent));
};

toxi.Rect.prototype = {
	containsPoint: function(p){
		var px = p.x;
		var py = p.y;
		if(px < this.x || px >= this.x + this.width){
			return false;
		}
		if(py < this.y || py >= this.y + this.height){
			return false;
		}
		return true;
	},
	
	copy: function(){
		return new toxi.Rect(this.x,this.y,this.width,this.height);
	},
	
	getArea: function(){
		return this.width * this.height;
	},
	
	getAspect: function(){
		return this.width / this.height;
	},
	
	getBottom: function(){
		return this.y + this.height;
	},
	
	getBottomRight: function(){
		return new toxi.Vec2D(this.x + this.width, this.y + this.height);
	},
	
	getCentroid: function(){
		return new toxi.Vec2D(this.x + this.width * 0.5, this.y + this.height * 0.5);
	},
	
	getDimensions: function(){
		return new toxi.Vec2D(this.width,this.height);
	},
	
	getEdge: function(id){
		var edge;
		switch(id){
			case 0:
				edge = new toxi.Line2D(
					new toxi.Vec2D(this.x,this.y),
					new toxi.Vec2D(this.x + this.width, this.y)
				);
				break;
			case 1:
				edge = new toxi.Line2D(
					new toxi.Vec2D(this.x + this.width, this.y),
					new toxi.Vec2D(this.x + this.width, this.y + this.height)
				);
				break;
			case 2:
				edge = new toxi.Line2D(
					new toxi.Vec2D(this.x, this.y + this.height),
					new toxi.Vec2D(this.x + this.width, this.y + this.height)
				);
				break;
			case 3:
				edge = new toxi.Line2D(
					new toxi.Vec2D(this.x,this.y),
					new toxi.Vec2D(this.x,this.y+this.height)
				);
				break;
			default:
				throw new Error("edge ID needs to be 0...3");
		}
		return edge;	
	},
	
	getLeft: function(){
		return this.x;
	},
	
	getRight: function(){
		return this.x + this.width;
	},
	
	getTop: function(){
		return this.y;
	},
	
	getTopLeft: function(){
		return new toxi.Vec2D(this.x,this.y);
	},
	
	intersectsRay: function(ray,minDist,maxDist){ 
		//returns Vec2D of point intersection
		var invDir = ray.getDirection().reciprocal();
		var signDirX = invDir.x < 0;
		var signDirY = invDir.y < 0;
		var min = this.getTopLeft();
		var max = this.getBottomRight();
		var bbox = signDirX ? max : min;
		var tmin = (bbox.x - ray.x) * invDir.x;
		bbox = signDirX ? min : max;
		var tmax = (bbox.x - ray.x) * invDir.x;
		bbox = signDirY ? max : min;
		var tymin = (bbox.y - ray.y) * invDir.y;
		bbox = signDirY ? min : max;
		var tymax = (bbox.y - ray.y) * invDir.y;
		if((tmin > tymax) || (tymin > tmax)){
			return undefined;
		}
		if(tymin > tmin){
			tmin = tymin;
		}
		if (tymax < tmax) {
            tmax = tymax;
        }
        if ((tmin < maxDist) && (tmax > minDist)) {
            return ray.getPointAtDistance(tmin); 
        }
        return undefined;
	},
	
	intersectsRect: function(r){
		return !(this.x > r.x + r.width || this.x + this.width < r.x || this.y > r.y + r.height || this.y + this.height < r.y);
	},
	
	scale: function(s){
		var c = this.getCentroid();
		this.width *= s;
		this.height *= s;
		this.x = c.x - this.width * 0.5;
		this.y = c.y - this.height * 0.5;
		return this;
	},
	
	set: function(x,y,width,height){
		if(arguments.length == -1){
			this.y = x.y;
			this.width = x.width;
			this.height = x.height;
			this.x = x.x;
		} else if(arguments.length === 4) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		} else {
			throw new Error("toxi.Rect set() received wrong parameters");
		}
	},
	
	setDimenions: function(dim){
		this.width = dim.x;
		this.height = dim.y;
		return this;
	},
	
	setPosition: function(pos){
		this.x = pos.x;
		this.y = pos.y;
		return this;
	},
	
	toPolygon2D: function(){
		var poly = new toxi.Polygon2D();
		poly.add(new toxi.Vec2D(this.x,this.y));
		poly.add(new toxi.Vec2D(this.x+this.width,this.y));
		poly.add(new toxi.Vec2D(this.x+this.width,this.y+this.height));
		poly.add(new toxi.Vec2D(this.x,this.y+this.height));
		return poly;
	},
	
	toString: function(){
		return "rect: {x: "+this.x +", y: "+this.y+ ", width: "+this.width+ ", height: "+this.height+"}";
	},
	
	union: function(r){
		var tmp = MathUtils.max(this.x + this.width, r.x + r.width);
		this.x = MathUtils.min(this.x,r.x);
		this.width = tmp - this.x;
		tmp = MathUtils.max(this.y + this.height, r.y + r.height);
		this.y = MathUtils.min(this.y,r.y);
		this.height = tmp - this.y;
		return this;
	}
};




