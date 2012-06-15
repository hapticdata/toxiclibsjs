define(["require", "exports", "module", "./TriangleMesh","../Vec3D","../Vec2D"], function(require, exports, module) {

var Vec3D = require('../Vec3D'),
	Vec2D = require('../Vec2D'),
	TriangleMesh = require('./TriangleMesh');

/**
 * @class An extensible builder class for {@link TriangleMesh}es based on 3D surface
 * functions using spherical coordinates. In order to create mesh, you'll need
 * to supply a {@link SurfaceFunction} implementation to the builder.
 * @member toxi
 */
var	SurfaceMeshBuilder = function(func) {
	this.func = func;
};

SurfaceMeshBuilder.prototype = {
	/*
		create a mesh from a surface,
		parameter options:
			1 - Object options
			1 - Number resolution
			3 - TriangleMesh mesh, Number resolution, Number size
			4 - TriangleMesh mesh, Number resolution, Number size, boolean isClosed
	*/
	createMesh: function() {
		var opts = {
			mesh: undefined,
			resolution: 0,
			size: 1,
			isClosed: true
		};
		if(arguments.length == 1){
			if(typeof arguments[0] == 'object'){ //options object
				var arg = arguments[0];
				//if a mesh was provided as an option, use it, otherwise make one
				opts.mesh = arg.mesh;
				opts.resolution = arg.res || arg.resoultion || 0;
				if(arg.size !== undefined){
					opts.size = arg.size;
				}
				if(arg.isClosed !== undefined){
					opts.isClosed = arg.isClosed;
				}
			} else { //resolution Number
				opts.resolution = arguments[0];
			}
		} else if(arguments.length > 2){
			opts.mesh = arguments[0];
			opts.resolution = arguments[1];
			opts.size = arguments[2];
			if(arguments.length == 4){
				opts.isClosed = arguments[3];
			}
		}
		var mesh = opts.mesh;
		if(mesh === undefined || mesh === null){
			mesh = new TriangleMesh(); 
		}
		
		var a = new Vec3D(),
			b = new Vec3D(),
			pa = new Vec3D(),
			pb = new Vec3D(),
			a0 = new Vec3D(),
			b0 = new Vec3D(),
			phiRes = this.func.getPhiResolutionLimit(opts.resolution),
			phiRange = this.func.getPhiRange(),
			thetaRes = this.func.getThetaResolutionLimit(opts.resolution),
			thetaRange = this.func.getThetaRange(),
			pres = 1.0 / phiRes, //(1 == opts.resolution % 2 ? opts.resolution - 0 : opts.resolution);
			tres = 1.0 / thetaRes,
			ires = 1.0 / opts.resolution,
			pauv = new Vec2D(),
			pbuv = new Vec2D(),
			auv = new Vec2D(),
			buv = new Vec2D();

		for (var p = 0; p < phiRes; p++) {
			var phi = p * phiRange * ires;
			var phiNext = (p + 1) * phiRange * ires;
			for (var t = 0; t <= thetaRes; t++) {
				var theta = t * thetaRange * ires;
				var func = this.func;
				a =	func.computeVertexFor(a, phiNext, theta).scaleSelf(opts.size);
				auv.set( t * tres, 1 - (p + 1) * pres);
				b = func.computeVertexFor(b, phi, theta).scaleSelf(opts.size);
				buv.set( t * tres, 1 - p * pres );
				if (b.equalsWithTolerance(a, 0.0001) ) {
					b.set(a);
				}
				if (t > 0) {
					if (t == thetaRes && opts.isClosed) {
						a.set(a0);
						b.set(b0);
					}
					mesh.addFace(pa, pb, a, pauv.copy(), pbuv.copy(), auv.copy());
					mesh.addFace(pb, b, a, pbuv.copy(), buv.copy(), auv.copy());
				} else {
					a0.set(a);
					b0.set(b);
				}
				pa.set(a);
				pb.set(b);
				pauv.set(auv);
				pbuv.set(buv);
			}
		}
		return mesh;
	},
	
	
	/**
	@return the function
	*/
	getFunction: function() {
		return this.func;
	},

	setFunction: function(func) {
		this.func = func;
	}
};
exports.SurfaceMeshBuilder = SurfaceMeshBuilder;
module.exports = SurfaceMeshBuilder;
});
