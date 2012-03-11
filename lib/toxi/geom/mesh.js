define(["require", "exports", "module", "./mesh/TriangleMesh","./mesh/BezierPatch","./mesh/BoxSelector","./mesh/DefaultSelector","./mesh/Face","./mesh/PlaneSelector","./mesh/SphereFunction","./mesh/SphericalHarmonics","./mesh/SurfaceMeshBuilder","./mesh/SuperEllipsoid","./mesh/Vertex","./mesh/VertexSelector"], function(require, exports, module) {
module.exports = {
	TriangleMesh: require('./mesh/TriangleMesh'),
	BezierPatch: require('./mesh/BezierPatch'),
	BoxSelector: require('./mesh/BoxSelector'),
	DefaultSelector: require('./mesh/DefaultSelector'),
	Face: require('./mesh/Face'),
	PlaneSelector: require('./mesh/PlaneSelector'),
	SphereFunction: require('./mesh/SphereFunction'),
	SphericalHarmonics: require('./mesh/SphericalHarmonics'),
	SurfaceMeshBuilder: require('./mesh/SurfaceMeshBuilder'),
	SuperEllipsoid: require('./mesh/SuperEllipsoid'),
	//Terrain: require('./mesh/Terrain'),
	Vertex: require('./mesh/Vertex'),
	VertexSelector: require('./mesh/VertexSelector')
};
});
