
var libUtils = require('../../libUtils'),
	ArraySet = require('../../utils/datatypes/ArraySet');

//statics
var __idGenerator = 0,
	moreInfo = false;


var DelaunayTriangle = function(collection){
	if(arguments.length > 1){
		Array.prototype.push.apply(this,arguments);
	} else if(arguments.length == 1){
		Array.prototype.push.apply(this,collection);
	}
	this.__circumcenter = undefined;
	this.__idNumber = __idGenerator++;
	if(this.length != 3){
		throw new Error("DelaunayTriangle must have 3 vertices");
	}
};

libUtils.extend(DelaunayTriangle,ArraySet);



libUtils.mixin(DelaunayTriangle.prototype,{
	facetOpposite: function(vertex){
		var facet = this.slice(0);
		var i = facet.indexOf(vertex);
		if( i < 0 ){
			throw new Error("Vertex not in triangle");
		}
		facet.splice(i,1);
		return facet;
	},
	getCircumcenter: function(){
		if(this.__circumcenter === undefined){
			this.__circumcenter = DelaunayVertex.circumcenter(this);
		}
		return this.__circumcenter;
	},
	getVertexButNot: function(badVertices){
		if(arguments.length == 1 && libUtils.isArray(badVertices)){
			return this.getVertexButNot.apply(this,badVertices);
		}
		badVertices = [];
		for(var i=0,len = arguments.length;i<len;i++){
			badVertices.push(arguments[i]);
		}
		for(var i=0,len=this.length;i<len;i++){
			if(badVertices.indexOf(this[i]) < 0){
				return this[i];
			}
		}
		throw new Error("No vertex found");
		return undefined;
	},
	isNeighbor: function(triangle){
		var	count = 0,
			vertex;
		for(var i = 0,len = this.length; i < len; i++){
			vertex = this[i];
			if(triangle.indexOf(vertex) < 0){
				count++;
			}
		}
		return count == 1;
	},
	iterator: function(){
		return new libUtils.Iterator(this);
	},
	toString: function(){
		if(!moreInfo){
			return "DelaunayTriangle" + this.__idNumber;
		}
		return "DelaunayTriangle" + this.__idNumber + Array.prototype.toString.apply(this,[]);
	}
});

module.exports = DelaunayTriangle;