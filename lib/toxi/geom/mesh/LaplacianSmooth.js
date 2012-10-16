define(['../../internals','../Vec3D', './DefaultSelector'], function( internals, Vec3D, DefaultSelector ){
	
	function generateKey( obj ) {
		return Vec3D.prototype.toString.call( obj );
	}
	var LaplacianSmooth = function(){};
	LaplacianSmooth.prototype = { filter: filter };

	//@param {VertexSelector | WETriangleMesh } selector or mesh
	//@param {Number} numIterations
	function filter( selector, numIterations ) {
		var selection, mesh, filtered;
		var v, laplacian, neighbors;
		var i,j,k,l, nl, fl;

		//used below for matching a filtered vertex to the mesh
		function updateMeshVertexMap( v, key ){
			mesh.vertexMap.get( key ).set( v );
		}

		if( typeof selector.addFace === 'function' ) {
			selector = new DefaultSelector( selector ).selectVertices();
		}
		selection = selector.getSelection();
		mesh = selector.getMesh();
		if ( typeof mesh.subdivide !== 'function' ) {
			throw Error( 'This filter requires a WETriangleMesh' );
		}
		l = selection.length;
		for ( i=0; i<numIterations; i++ ) {
			filtered = new internals.LinkedMap( generateKey );
			for ( j=0; j<l; j++ ){
				v = selection[i];
				laplacian = new Vec3D();
				neighbors = v.getNeighbors();
				nl = neighbors.length;
				for ( k=0; k<nl; k++ ){
					laplacian.addSelf( neighbors[k] );
				}
				laplacian.scaleSelf( 1 / nl );
				filtered.put( v, laplacian );
			}
			fl = filtered.size();
			filtered.each( updateMeshVertexMap );
			mesh.rebuildIndex();
		}
		mesh.computeFaceNormals();
		mesh.computeVertexNormals();
	}

	//adding this to the object for sugar, no need for this to be an instance
	LaplacianSmooth.filter = filter;
	return LaplacianSmooth;
});