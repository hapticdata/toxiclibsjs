define(["require", "exports", "module", "./mesh/BezierPatch","./mesh/BoxSelector","./mesh/DefaultSelector","./mesh/Face","./mesh/OBJWriter","./mesh/PlaneSelector","./mesh/SphereFunction","./mesh/SphericalHarmonics","./mesh/SurfaceMeshBuilder","./mesh/SuperEllipsoid","./mesh/TriangleMesh","./mesh/Vertex","./mesh/VertexSelector","./mesh/Terrain"], function(require, exports, module) {
module.exports = {
	TriangleMesh: require('./mesh/TriangleMesh'),
	BezierPatch: require('./mesh/BezierPatch'),
	BoxSelector: require('./mesh/BoxSelector'),
	DefaultSelector: require('./mesh/DefaultSelector'),
	Face: require('./mesh/Face'),
	OBJWriter: require('./mesh/OBJWriter'),
	PlaneSelector: require('./mesh/PlaneSelector'),
	SphereFunction: require('./mesh/SphereFunction'),
	SphericalHarmonics: require('./mesh/SphericalHarmonics'),
	SurfaceMeshBuilder: require('./mesh/SurfaceMeshBuilder'),
	SuperEllipsoid: require('./mesh/SuperEllipsoid'),
	Terrain: require('./mesh/Terrain'),
	TriangleMesh: require('./mesh/TriangleMesh'),
	Vertex: require('./mesh/Vertex'),
	VertexSelector: require('./mesh/VertexSelector')
};
});
