define(['../../internals','../Vec3D', './DefaultSelector', './meshCommon'], function( internals, Vec3D, DefaultSelector, meshCommon ){
	

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
			var changedVertex = mesh.vertexMap.get( key );
			if( changedVertex === undefined ){
				console.log("missing vertex");
			} else {
				changedVertex.set( v );
			}
		}

		//this means it was a WETriangleMesh not a selector
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
			//it is very important to use TriangleMesh's keyGenerator for matching
			filtered = new internals.LinkedMap( meshCommon.TriangleMesh.__vertexKeyGenerator );
			for ( j=0; j<l; j++ ){
				v = selection[i];
				laplacian = new Vec3D();
				neighbors = v.getNeighbors();
				nl = neighbors.length;
				console.log("neighbors.length: "+nl);
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