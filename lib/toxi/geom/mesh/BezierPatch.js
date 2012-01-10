define(["require", "exports", "module", "../Vec3D","./TriangleMesh"], function(require, exports, module) {
var Vec3D = require('../Vec3D'),
	TriangleMesh = require('./TriangleMesh');

/**
 * @class 4x4 bezier patch implementation with tesselation support (dynamic resolution)
 * for generating triangle mesh representations.
 * @member toxi
 */
var	BezierPatch = function(points){
	this.points = (points === undefined)?[] : points;
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			this.points[i][j] = new Vec3D();
		}
	}
};

BezierPatch.prototype = {
	
	computePointAt: function(u,v) {
		return this.computePointAt(u, v, this.points);
	},

	set: function(x,y,p) {
		this.points[y][x].set(p);
		return this;
	},

	toMesh: function(mesh_or_res,_res) {
		var mesh,
			res;
		if(_res === undefined){
			mesh = new TriangleMesh();
			res = mesh_or_res;
		} else {
			mesh = mesh_or_res;
			res = _res;
		}
		var curr = new Array(res + 1),
			prev = new Array(res + 1);
		var r1 = 1.0 / res;
		for (var y = 0; y <= res; y++) {
			for (var x = 0; x <= res; x++) {
				var p = this.computePointAt(x * r1, y * r1, this.points);
				if (x > 0 && y > 0) {
					mesh.addFace(p, curr[x - 1], prev[x - 1]);
					mesh.addFace(p, prev[x - 1], prev[x]);
				}
				curr[x] = p;
			}
			var tmp = prev;
			prev = curr;
			curr = tmp;
		}
		return mesh;

	}
};

/**
Computes a single point on the bezier surface given by the 2d array of
control points. The desired point's coordinates have to be specified in
UV space (range 0.0 .. 1.0). The implementation does not check or enforce
the correct range of these coords and will not return valid points if the
range is exceeded.
@param u positive normalized U coordinate on the bezier surface
@param v positive normalized V coordinate on the bezier surface
@param points 4x4 array defining the patch's control points
@return point on surface
*/

BezierPatch.computePointAt = function(u,v,points){
		var u1 = 1 - u;
		var u1squared = u1 * u1 * 3 * u,
		u1cubed = u1 * u1 * u1,
		usquared = u * u,
		v1 = 1 - v,
		vsquared = v * v * 3,
		v1squared = v1 * v1 * 3,
		v1cubed = v1 * v1 * v1,
		vcubed = v * v * v,

		u1usq = u1 * usquared * 3,
		usqu = u * usquared,
		v1vsq = v1 * vsquared,
		v1sqv = v1squared * v;

		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];
		var p3 = points[3];

		var x = u1cubed * (p0[0].x * v1cubed + p0[1].x * v1sqv + p0[2].x * v1vsq + p0[3].x * vcubed) + u1squared * (p1[0].x * v1cubed + p1[1].x * v1sqv + p1[2].x * v1vsq + p1[3].x * vcubed) + u1usq * (p2[0].x * v1cubed + p2[1].x * v1sqv + p2[2].x * v1vsq + p2[3].x * vcubed) + usqu * (p3[0].x * v1cubed + p3[1].x * v1sqv + p3[2].x * v1vsq + p3[3].x * vcubed);

		var y = u1cubed * (p0[0].y * v1cubed + p0[1].y * v1sqv + p0[2].y * v1vsq + p0[3].y * vcubed) + u1squared * (p1[0].y * v1cubed + p1[1].y * v1sqv + p1[2].y * v1vsq + p1[3].y * vcubed) + u1usq * (p2[0].y * v1cubed + p2[1].y * v1sqv + p2[2].y * v1vsq + p2[3].y * vcubed) + usqu * (p3[0].y * v1cubed + p3[1].y * v1sqv + p3[2].y * v1vsq + p3[3].y * vcubed);

		var z = u1cubed * (p0[0].z * v1cubed + p0[1].z * v1sqv + p0[2].z * v1vsq + p0[3].z * vcubed) + u1squared * (p1[0].z * v1cubed + p1[1].z * v1sqv + p1[2].z * v1vsq + p1[3].z * vcubed) + u1usq * (p2[0].z * v1cubed + p2[1].z * v1sqv + p2[2].z * v1vsq + p2[3].z * vcubed) + usqu * (p3[0].z * v1cubed + p3[1].z * v1sqv + p3[2].z * v1vsq + p3[3].z * vcubed);

		return new Vec3D(x, y, z);

};

module.exports = BezierPatch;
});
