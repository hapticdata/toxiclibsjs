toxi.DelaunayVertex = function(){
	var a;
	this.coordinates = [];
	if(arguments.length == 1 && arguments[0] instanceof Object && arguments[0].length > 0){
		a = arguments[0];
	} else {
		a = arguments;
	}
	for(var i =0;i<a.length;i++){
		this.coordinates[i] = a[i];
	}
};

toxi.DelaunayVertex.prototype = {
	add: function(p){
		var len = this.dimCheck(p);
		var coords = [];
		for(var i=0;i<len;i++){
			coords[i] = this.coordinates[i] + p.coordinates[i];
		}
		return new toxi.DelaunayVertex(coords);
	},
	
	angle: function(p){
		return Math.acos(this.dot(p) / (this.magnitud() * p.magnitude()));
	},
	
	bisector: function(point){
		this.dimCheck(point);
		var diff = this.subtract(point),
			sum = this.add(point),
			dot = diff.dot(sum);
		return diff.extend(-dot/2);
	},
	
	coord: function(i){
		return this.coordinates[i];
	},
	
	dimCheck: function(p){
		var len = this.coordinates.length;
		if(len != p.coordinates.length){
			throw new Error("IllegalArgumentException Dimension Mismatch");
		}
		return len;
	},
	
	dimension: function(){
		return this.coordinates.length;
	},
	
	dot: function(p){
		var len = this.dimCheck(p),
			sum = 0;
		for(var i=0;i<len;i++){
			sum += this.coordinates[i] * p.coordinates[i];
		}
		return sum;
	},
	
	equals: function(other){
		if(!(other instanceof DelaunayVertex)){
			return false;
		}
		if(this.coordinates.length != other.coordinates.length){
			return false;
		}
		for(var i=0;i<this.coordinates.length;i++){
			if(this.coorindates[i] != other.coordinates[i]){
				return false;
			}
		}
		return true;
	},
	
	extend: function(){
		var a;
		if(arguments.length == 1 && arguments[0] instanceof Object && arguments[0].length > 0){
			a = arguments[0];
		} else {
			a = arguments;
		}
		for(var i=0;i<a.length;i++){
			this.coordinates.push(a[i]);
		}
	},
	
	hashCode: function(){
		console.log("DelaunayVertex.hasCode() not implemented");
	},
	
	isInside: function(simplex){
		var result = this.relation(simplex);
		for(var i=0;i<result.length;i++){
			if(result[i] >= 0){
				return false;
			}
		}
		return true;
	},
	
	isOn: function(simplex){
		var result = this.relation(simplex),
			witness = undefined;
		for(var i=0;i<result.length;i++){
			if(result[i] === 0){
				witness = simplex[i];
			} else if(result[i] > 0){
				return undefined;
			}
		}
		return witness;
	},
	
	isOutside: function(simplex){
		var result = this.relation(simplex);
		for(var i=0;i<result.length;i++){
			if(result[i] > 0){
				return simplex[i];
			}
		}
		return undefined;
	},
	
	magnitude: function(){
		return Math.sqrt(this.dot(this));
	},
	
	/**
	* Relation between this DelaunayVertex and a simplex (represented as an
	* array of Pnts). Result is an array of signs, one for each vertex of the
	* simplex, indicating the relation between the vertex, the vertex's
	* opposite facet, and this DelaunayVertex.
	* 
	* <pre>
	*   -1 means DelaunayVertex is on same side of facet
	*    0 means DelaunayVertex is on the facet
	*   +1 means DelaunayVertex is on opposite side of facet
	* </pre>
	* 
	* @param simplex an array of Pnts representing a simplex
	* @return an array of signs showing relation between this DelaunayVertex and simplex
	* @throws IllegalArgumentExcpetion if the simplex is degenerate
	*/
	
	relation: function(simplex){
	
		var dim = simplex.length -1,
			matrix = [],
			coords = [],
			i = 0;
		/*
		* In 2D, we compute the cross of this matrix: 1 1 1 1 p0 a0 b0 c0 p1 a1
		* b1 c1 where (a, b, c) is the simplex and p is this DelaunayVertex.
		* The result is a vector in which the first coordinate is the signed
		* area (all signed areas are off by the same constant factor) of the
		* simplex and the remaining coordinates are the *negated* signed areas
		* for the simplices in which p is substituted for each of the vertices.
		* Analogous results occur in higher dimensions.
		*/
		if(this.dimension() != dim){
			throw new Error("IllegalArgumentException Dimension Mismatch");
		}
		
		//first row
		for(i = 0;i<(dim+2);i++){
			coords[i] = 1;
		}
		
		matrix[0] = new toxi.DelaunayVertex(coords);
		//other rows
		for(i = 0;i<dim;i++){
			coords[0] = this.coordinates[i];
			for(var j=0;j<simplex.length;j++){
				coords[j + 1] = simplex[j].coordintes[i];
			}
			matrix[i + 1] = new toxi.DelaunayVertex(coords);
		}
		
		//Compute and analyze the vector of areas/volumes/contents
		var vector = toxi.DelaunayVertex.cross(matrix),
			content = vector.coordinates[0],
			result = [],
			value;
		for(i=0;i<result.length;i++){
			value = vector.coordinates[i + 1];
			if(Math.abs(value) <= 1.0e-6 * Math.abs(content)){
				result[i] = 0;
			} else if(value < 0){
				result[i] = -1;
			} else {
				result[i] = 1;
			}
		}
		if(content < 0){
			for(i=0;i<result.length;i++){
				result[i] = -result[i];
			}
		}
		if(content === 0){
			for(i=0;i<result.length;i++){
				result[i] = Math.abs(result[i]);
			}
		}
		return result;
	},
	
	subtract: function(p){
		var len = this.dimCheck(p),
			coords = [];
		for(var i=0;i<len;i++){
			coords[i] = this.coordinates[i] - p.coordinates[i];
		}
		return new toxi.DelaunayVertex(coords);
	},
	
	toString: function(){
		if(this.coordinates.length === 0){
			return "DelaunayVertex()";
		}
		var result = "DelaunayVertex("+this.coordinates[0];
		for(var i=1,len<this.coordinates.length; i<len;i++){
			result += ","+this.coordinates[i];
		}
		result += ")";
		return result;
	},
	
	toVec2D: function(){
		return new toxi.Vec2D(this.coordinates[0],this.coordinates[1]);
	},
	
	vsCircumcircle: function(simplex){
		var matrix = [];
		for(var i=0;i<simplex.length;i++){
			matrix[i] = simplex[i].extend(1, simplex[i].dot(simplex[i]));
		}
		matrix[simplex.length] = this.extend(1,this.dot(this));
		var d = toxi.DelaunayVertex.determinant(matrix),
			result = (d < 0) ? -1 : ((d > 0) ? +1 : 0);
		if(toxi.DelaunayVertex.content(simplex) < 0){
			result = -result;
		}
		return result;
	}
};

toxi.DelaunayVertex.circumcenter = function(simplex){
	var dim = simplex[0].dimension(),
		matrix = [],
		i = 0;
	if(simplex.length - 1 != dim) { 
		throw new Error("IllegalArgumentException Dimension Mismatch");
	}
	for(i=0;i<dim;i++){
		matrix[i] = simplex[i].bisector(simplex[i + 1]);
	}
	var hCenter = toxi.DelaunayVertex.cross(matrix),
		last = hCenter.coordinates[dim],
		result = [];
	for(i=0;i<dim;i++){
		result[i] = hCenter.coordinates[i] / last;
	}
	return new toxi.DelaunayVertex(result);
};

toxi.DelaunayVertex.content = function(simplex){
	var matrix = [],
		i = 0,
		fact =1;
	for(i =0;i<simplex.length;i++){
		matrix[i] = simplex[i].extend(1);
	}
	for(i=1;i<matrix.length;i++){
		fact = fact * i;
	}
	return toxi.DelaunayVertex.determinant(matrix) / fact;
};

toxi.DelaunayVertex.cross = function(matrix){
	var len = matrix.length + 1,
		columns = [],
		result = [],
		sign = 1,
		i = 0;
	if(len != matrix[0].dimension()) {
		throw new Error("IllegalArgumentException Dimension mismatch");
	}
	for(i=0;i<len;i++){
		columns[i] = true;
	}
	try {
		for(i=0;i<len;i++){
			columns[i] = false;
			result[i] = sign * toxi.DelaunayVertex.determinant(matrix,0,columns);
			columns[i] = true;
			sign = -sign;
		}
	} catch(e){
		throw new Error("IllegalArgument Exception Matrix is wrong shape: "+e):
	}
	return new toxi.DelaunayVertex(result);
};

toxi.DelaunayVertex.determinant = function(matrix, row, columns){
	if(arguments.length == 1){
		if(matrix.length != matrix[0].dimension()) {
			throw new Error("IllegalArgumentException Matrix is not square");
		}
		columns = [];
		for(var i=0;i<matrix.length;i++){
			columns[i] = true;
		}
		
		try {
			return new toxi.DelaunayVertex.determinant(matrix,0,columns);
		} catch(e){
			throw new Error("IllegalArgumentException Matrix is wrong shape: "+e):
		}
	} else { //all 3 provided
		if(row == matrix.length){
			return 1;
		}
		var sum = 0,
			sign = 1;
		for(var col = 0; col<columns.length; col++){
			if(!columns[col]){
				continue;
			}
			columns[col] = false;
			sum += sign * matrix[row].coordinates[col] * toxi.DelaunayVertex.determinant(matrix,row+1,columns);
			columns[col] = true;
			sign = -sign;
		}
		return sum;
	}
};


toxi.Delaunay.toString = function(matrix){
	var buf = "";
	for(var i=0;i<matrix.length;i++){
		buf += " " + matrix[i].toString();
	}
	buf += " }";
	return buf;
};