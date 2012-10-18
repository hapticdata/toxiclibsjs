define(['./TriangleMesh'], function( TriangleMesh ){
	//WETriangleMesh is defined in toxi/geom/mesh/TriangleMesh
	//this is to avoid circular dependecy
	return TriangleMesh.WETriangleMesh;
});