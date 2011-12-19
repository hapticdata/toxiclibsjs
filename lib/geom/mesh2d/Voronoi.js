
var DelaunayTriangle = require('./DelaunayTriangle'),
	DelauanayTriangulation = require('./DelaunayTriangulation'),
	DelaunayVertex = require('./DelaunayVertex'),
	Vec2D = require('../Vec2D'),
	Polygon2D = require('../Polygon2D'),
	Triangle2D = require('../Triangle2D');

var Voronoi = function(size){
	size = size || Voronoi.DEFAULT_SIZE;
	this._initialTriangle = new DelaunayTriangle(new DelaunayVertex(-size,-size), new DelaunayVertex(size,-size), new DelaunayVertex(0,size));
	this._delaunay = new DelaunayTriangulation(this._initialTriangle);
	this._sites = [];	
};

Voronoi.DEFAULT_SIZE = 10000;

Voronoi.prototype = {
	addPoint: function(p){
		this._sites.push(p.copy());
		this._delaunay.delaunayPlace(new DelaunayVertex(p.x,p.y));
	},
	
	addPoints: function(points){
		for(var i=0,len = points.length;i<len;i++){
			this.addPoint(points[i]);
		}
	},
	
	getRegions: function(){
		var regions = [],
			done = this._initialTriangle.slice(0),
			triangle,
			site,
			list,
			poly,
			tri,
			circumeter;

		var iterator = this._delaunay.iterator();
		while(iterator.hasNext()){
			triangle = iterator.next();
			if(typeof triangle !== 'function'){
				for(var j=0,vlen = triangle.size();j<vlen;j++){
					site = triangle[j];
					if(done.indexOf(site) >= 0){
						continue;
					}
					done.push(site);
					list = this._delaunay.surroundingTriangles(site,triangle);
					poly = new Polygon2D();
					for(var k=0,klen = list.length;k<klen;k++){
						tri = list[k];
						circumeter = tri.getCircumcenter();
						poly.add(new Vec2D(circumeter.coord(0),circumeter.coord(1)));
					}
					regions.push(poly);
				}
			}
		}
		return regions;
	},

	getSites: function(){
		return this._sites;	
	},

	getTriangles: function(){
		var tris = [];
		for(var i = 0,len = this._delaunay.length;i<len;i++){
			tris.push(new Triangle2D(t.get(0).toVec2D(),t.get(1).toVec2D(),t.get(2).toVec2D()));
		}
		return tris;
	}
};

module.exports = Voronoi;