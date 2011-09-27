toxi.Voronoi = function(size){
	size = size || toxi.Voronoi.DEFAULT_SIZE;
	this.initialTriangle = new toxi.DelaunayTriangle(new toxi.DelaunayVertex(-size,-size), new toxi.DelaunayVertex(size,-size), new toxi.DelaunayVertex(0,size));
	this.delaunay = new toxi.DelaunayTriangulation(this.initialTriangle);
	this.sites = [];	
};

toxi.Voronoi.prototype = {
	addPoint: function(p){
		this.sites.push(p.copy());
		this.delaunay.delaunayPlace(new toxi.DelaunayVertex(p.x,p.y));
	},
	
	addPoints: function(points){
		for(var i=0;i<points.length;i++){
			this.addPoint(points[i]);
		}
	},
	
	getRegions: function(){
		var regions = [],
			done = {};
		for(var i=0,tlen = this.delaunay.length;i<tlen;i++){
			var triangle = this.delaunay[i];
			for(var j=0,vlen = triangle.length;j++){
				
			}
		}
	}
};