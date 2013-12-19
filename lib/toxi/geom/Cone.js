define(["require", "exports", "module", "../internals","./Vec3D","./mesh/TriangleMesh"], function(require, exports, module) {

var extend = require('../internals').extend,
	Vec3D = require('./Vec3D'),
	TriangleMesh = require('./mesh/TriangleMesh');

/**
 * @class A geometric definition of a cone (and cylinder as a special case) with
 * support for mesh creation/representation. The class is currently still
 * incomplete in that it doesn't provide any other features than the
 * construction of a cone shaped mesh.
 * @augments toxi.Vec3D
 * @member toxi
 * @param pos
 *            centre position
 * @param dir
 *            direction vector
 * @param rNorth
 *            radius on the side in the forward direction
 * @param rSouth
 *            radius on the side in the opposite direction
 * @param len
 *            length of the cone
 */

function err( param ){
	throw Error("Missing parameter: " + param);
}
var	Cone = function(pos,dir,rNorth, rSouth,len) {
	//if its a parameter object
	var self = this;
	if ( typeof pos === 'object' && arguments.length === 1 ){
		process(
			pos.pos || pos.position || new Vec3D(),
			pos.dir || pos.direction || err( "direction" ),
			pos.rNorth || pos.radiusNorth || err("radiusNorth"),
			pos.rSouth || pos.radiusSouth || err("radiusSouth"),
			pos.len || pos.length || err("length")
		);
	} else {
		process( pos, dir, rNorth, rSouth, len );
	}
	function process( pos, dir, radiusNorth, radiusSouth, length ){
		Vec3D.apply(self,[pos]);
		self.dir = dir.getNormalized();
		self.radiusNorth = radiusNorth;
		self.radiusSouth = radiusSouth;
		self.length = length;
	}
};

extend(Cone,Vec3D);

Cone.prototype.toMesh = function(args) {
	var opts = {
		mesh : undefined,
		steps : NaN,
		thetaOffset : 0,
		topClosed : true,
		bottomClosed : true
	};
	
		
	if ( arguments.length == 1) {
		if (typeof arguments[0] == 'object') {
			//##then it was a javascript option-object
			var optionsObject = arguments[0];
			opts.mesh = optionsObject.mesh;
			opts.steps = optionsObject.steps || optionsObject.resolution || optionsObject.res;
			opts.thetaOffset = optionsObject.thetaOffset || opts.thetaOffset;
			opts.topClosed = optionsObject.topClosed || opts.topClosed;
			opts.bottomClosed = optionsObject.bottomClosed || opts.bottomClosed;
		} else {
			opts.steps = arguments[0];
		}
	}
	else if ( arguments.length == 2 ) {
		opts.steps = arguments[0];
		opts.thetaOffset = arguments[1];
	}
	else if ( arguments.length == 5 ) {
		opts.mesh = arguments[0];
		opts.steps = arguments[1];
		opts.thetaOffset = arguments[2];
		opts.topClosed = arguments[3];
		opts.bottomClosed = arguments[4];
	}
	
	var c = this.add(0.01, 0.01, 0.01),
		n = c.cross(this.dir.getNormalized()).normalize(),
		halfAxis = this.dir.scale(this.length * 0.5),
		p = this.sub(halfAxis),
		q = this.add(halfAxis),
		south = [],
		north = [],
		phi = (Math.PI*2) / opts.steps;
	
	
	var i = 0, j=1;
	for(i=0;i<opts.steps;i++){
		var theta = i * phi + opts.thetaOffset;
		var nr = n.getRotatedAroundAxis(this.dir,theta);
			
		south[i] = nr.scale(this.radiusSouth).addSelf(p);
		north[i] = nr.scale(this.radiusNorth).addSelf(q);
	}
	
	
	var numV = opts.steps * 2 + 2,
		numF = opts.steps * 2 + (opts.topClosed ? opts.steps : 0) + (opts.bottomClosed ? opts.steps : 0),
		mesh = opts.mesh || new TriangleMesh("cone",numV,numF);

	for(i=0; i<opts.steps; i++, j++){
		if(j == opts.steps){
			j = 0;
		}
		mesh.addFace(south[i],north[i],south[j],undefined,undefined,undefined,undefined);
		mesh.addFace(south[j],north[i],north[j],undefined,undefined,undefined,undefined);
		if(opts.bottomClosed){
			mesh.addFace(p, south[i], south[j], undefined,undefined,undefined,undefined);
		}
		if(opts.topClosed){
			mesh.addFace(north[i], q, north[j], undefined,undefined,undefined,undefined);
		}
	}
	
	return mesh;
};

module.exports = Cone;

});
