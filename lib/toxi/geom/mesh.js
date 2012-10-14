define(["require", "exports", "./mesh/BezierPatch","./mesh/BoxSelector","./mesh/DefaultSelector","./mesh/Face","./mesh/OBJWriter","./mesh/PlaneSelector","./mesh/SphereFunction","./mesh/SphericalHarmonics","./mesh/SurfaceMeshBuilder","./mesh/SuperEllipsoid","./mesh/TriangleMesh","./mesh/Vertex","./mesh/VertexSelector","./mesh/Terrain", "./mesh/WETriangleMesh"], function(require, exports) {
	exports.TriangleMesh = require('./mesh/TriangleMesh');
	exports.BezierPatch = require('./mesh/BezierPatch');
	exports.BoxSelector = require('./mesh/BoxSelector');
	exports.DefaultSelector = require('./mesh/DefaultSelector');
	exports.Face = require('./mesh/Face');
	exports.OBJWriter = require('./mesh/OBJWriter');
	exports.PlaneSelector = require('./mesh/PlaneSelector');
	exports.SphereFunction = require('./mesh/SphereFunction');
	exports.SphericalHarmonics = require('./mesh/SphericalHarmonics');
	exports.SurfaceMeshBuilder = require('./mesh/SurfaceMeshBuilder');
	exports.SuperEllipsoid = require('./mesh/SuperEllipsoid');
	exports.Terrain = require('./mesh/Terrain');
	exports.TriangleMesh = require('./mesh/TriangleMesh');
	exports.WETriangleMesh = require('./mesh/WETriangleMesh');
	exports.Vertex = require('./mesh/Vertex');
	exports.VertexSelector = require('./mesh/VertexSelector');
});
