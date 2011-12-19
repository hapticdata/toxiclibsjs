
var libUtils = require('../../libUtils'),
	ArraySet = require('../../utils/datatypes/ArraySet'),
	UndirectedGraph = require('../../utils/datatypes/UndirectedGraph');

var DelaunayTriangulation = function(triangle){
	this.__triGraph = new UndirectedGraph();
	this.__triGraph.add(triangle);
	this.__mostRecent = triangle;
};

libUtils.extend(DelaunayTriangulation,ArraySet);

libUtils.mixin(DelaunayTriangulation.prototype,{
	contains: function(triangle){
		return this.__triGraph.getNodes().indexOf(triangle) >= 0;
	},
	delaunayPlace: function(site){
		// Uses straightforward scheme rather than best asymptotic time
        // Locate containing trianglevar triangle = this.locate(site);
		var triangle = this.locate(site);
		// Give up if no containing triangle or if site is already in DT
		if(triangle === undefined){
			throw new Error("No containing triangle");
		}
		if(triangle.contains(site)) {
			return;
		}
		var cavity = this.__getCavity(site,triangle);
		this.__mostRecent = this.__update(site,cavity);
	},
	__getCavity: function(site,triangle){
		var	encroached = [],
			toBeChecked = [],
			marked = [];
		
		toBeChecked.push(triangle);
		marked.push(triangle);
		while(toBeChecked.length > 0){
			triangle = toBeChecked.shift();
			if(site.vsCircumcircle(triangle) == 1){
				continue;
			}
			encroached.push(triangle);
			var nodes = this.__triGraph.getConnectedNodesFor(triangle),
				i = 0,
				len = nodes.size(),
				neighbor;
			for(i = 0; i < len; i++){
				neighbor = nodes[i];
				if(marked.indexOf(neighbor) >= 0){
					continue;
				}
				marked.push(neighbor);
				toBeChecked.push(neighbor);
			}
		}
		return encroached;
	},
	iterator: function(){
		return new libUtils.Iterator(this.__triGraph.getNodes());
	},
	locate: function(point){
		var triangle = this.__mostRecent;
		if(!this.contains(triangle)){
			triangle = undefined;
		}
		// Try a directed walk (this works fine in 2D, but can fail in 3D)
		var visited = new ArraySet();
		while(triangle !== undefined){
			if(visited.contains(triangle)){
				throw new Error("Caught in a locate loop");
			}
			visited.add(triangle);
			//Corner opposite point
			var corner = point.isOutside(triangle);
			if(corner === undefined){
				return triangle;
			}
			triangle = this.neighborOpposite(corner, triangle);
		}
		// No luck, try brute force
		console.warn("Warning: Checking all triangles for " +point);
		for(var i =0,len = this.length;i<len;i++){
			var tri = this[i];
			if(point.isOutside(tri) === undefined){
				return tri;
			}
		}
		// No such triangle
		return undefined;
	},
	neighborOpposite: function(site, triangle){
		if(triangle.indexOf(site) < 0){
			console.warn("Bad vertex; not in triangle");
		}
		var nodes = this.__triGraph.getConnectedNodesFor(triangle),
			i = 0,
			len = nodes.length,
			neighbor;

		for(i = 0; i < len; i++){
			neighbor = nodes[i];
			if(neighbor.indexOf(site) < 0){
				return neighbor;
			}
		}
		return undefined;
	},
	neighbors: function(triangle){
		return this.__triGraph.getConnectedNodesFor(triangle);
	},
	//override ArraySet
	size: function(){
		return this.__triGraph.getNodes().length;
	},
	surroundingTriangles: function(site, triangle){
		if(!triangle.contains(site)){
			console.warn("Site not in triangle");
		}

		var list = [],
			start = triangle,
			guide = triangle.getVertexButNot(site),
			previous;
		
		while(true){
			list.push(triangle);
			previous = triangle;
			triangle = this.neighborOpposite(guide, triangle); //Next triangle
			guide = previous.getVertexButNot(site, guide); //Update guide
			if(triangle == start){
				return list;
			}
		}
		return list;
	},
	toString: function(){
		return "DelaunayTriangulation with "+ this.length + " triangles";
	},
	__update: function(site, cavity){
		var self = this,
			boundary = new ArraySet(),
			theTriangles = new ArraySet(),
			triangle;
		// Find boundary facets and adjacent triangles
		for(var c=0,clen = cavity.length;c<clen;c++){
			var	triangle = cavity[c],
				neighbors = self.neighbors(triangle);
			theTriangles.addAll(neighbors);
			for(var t=0,tlen = triangle.length;t<tlen;t++){
				var	vertex = triangle[t],
					facet = triangle.facetOpposite(vertex);
				if(boundary.contains(facet)){
					boundary.remove(facet);
				} else {
					boundary.add(facet);
				}
			}
		}
		theTriangles.removeAll(cavity); //Adj triangles only
		// Remove the cavity triangles from the triangulation
		for(var i=0,len = cavity.length;i<len;i++){
			triangle = cavity[i];
			self.__triGraph.remove(triangle);
		}

		// Build each new triangle and add it to the triangulation
		var newTriangles = new ArraySet();
		for(var b=0,blen = boundary.length;b<blen;b++){
			var vertices = boundary[b];
			vertices.push(site);
			var tri = new DelaunayTriangle(vertices);
			self.__triGraph.add(tri);
			newTriangles.add(tri);
		}

		// Update the graph links for each new triangle
    	theTriangles.addAll(newTriangles); // Adj triangle + new triangles
    	for(var nt=0,ntlen = newTriangles.length;nt<ntlen;nt++){
    		triangle = newTriangles[nt];
    		for(var tt = 0,ttlen = theTriangles.length;tt<ttlen;tt++){
    			var other = theTriangles[tt];
    			if(triangle.isNeighbor(other)){
    				self.__triGraph.connect(triangle,other);
    			}
    		}
    	}

    	//Return one of the new triangles
    	var oneNewTriangle = newTriangles.iterator().next();
    	return oneNewTriangle;
	}
});

module.exports = DelaunayTriangulation;