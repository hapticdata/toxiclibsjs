/**
 * Implementation of a 2D grid based heightfield with basic intersection
 * features and conversion to {@link TriangleMesh}. The terrain is always
 * located in the XZ plane with the positive Y axis as up vector.
 */
define(function(require){
	//toxi.geom.mesh.Terrain is in meshCommon to avoid circular dependencies
	return require('./meshCommon').Terrain;
});