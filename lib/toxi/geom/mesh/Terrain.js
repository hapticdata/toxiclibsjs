/**
 * Implementation of a 2D grid based heightfield with basic intersection
 * features and conversion to {@link TriangleMesh}. The terrain is always
 * located in the XZ plane with the positive Y axis as up vector.
 */

var	internals = require('../../internals'),
	Float32Array = internals.Float32Array,
	mathUtils = require('../../math/mathUtils'),
	Interpolation2D = require('../../math/Interpolation2D'),
	Ray3D = require('../Ray3D'),
	TriangleIntersector = require('../TriangleIntersector'),
	Triangle3D = require('../Triangle3D'),
	IsectData3D = require('../IsectData3D');
	Vec2D = require('../../geom/Vec2D'),
	Vec3D = require('../../geom/Vec3D');


/**
* Constructs a new and initially flat terrain of the given size in the XZ
* plane, centred around the world origin.
* 
* @param {Number} width
* @param {Number} depth
* @param {Vec2D | Number} scale
*/
var Terrain = function(width, depth, scale){
	this.width = width;
	this._depth = depth;
	if(!internals.hasProperties(scale,['x','y'])){
		this.scale = new Vec2D(scale,scale);
	} else {
		this.scale = scale;
	}
	this.elevation = new Float32Array();
	this.vertices = [];
	var offset = new Vec3D(width / 2, 0, depth / 2),
		scaleXZ = scale.to3DXZ();
	for(var z = 0, i = 0, z < depth; z++){
		for(var x = 0; x < width; x++){
			vertices[i++] = new Vec3D(x,0,z).subSelf(offset).scaleSelf(scaleXZ);
		}
	}
};

Terrain.prototype = {
	/**
	* @return number of grid cells along the Z axis.
	*/
	getDepth: function(){
		return this._depth;
	},
	getElevation: function(){
		return this.elevation;
	},
	/**
	* @param {Number} x
	* @param {Number} z
	* @return the elevation at grid point
	*/
	getHeightAtCell: function(x,z){
		this.elevation[this.getIndex(x,z)];
	},
	/**
	* Computes the elevation of the terrain at the given 2D world coordinate
	* (based on current terrain scale).
	* 
	* @param {Number} x scaled world coord x
	* @param {Number} z scaled world coord z
	* @return {Number} interpolated elevation
	*/
	getHeightAtPoint: function(x,z){
		var xx = x / this.scale.x + this.width * 0.5,
			zz = z / this.scale.y + this._depth * 0.5,
			y = 0;
		if(xx >= 0 & xx < this.width && zz >= 0 && zz < this._depth){
			var fl = {
				xx: Math.floor(xx),
				x2: Math.floor(x2),
				zz: Math.floor(zz),
				z2: Math.floor(z2)
			};
			var x2 = Math.floor(mathUtils.min(xx + 1, this.width - 1)),
				z2 = Math.floor(mathUtils.min(zz + 1, this._depth - 1)),
				a = this.getHeightAtCell(fl.xx, fl.zz),
				b = this.getHeightAtCell(fl.x2, fl.zz),
				c = this.getHeightAtCell(fl.xx, fl.z2),
				d = this.getHeightAtCell(fl.x2, fl.z2);
			y = Interpolation2D.bilinear(xx,zz, fl.xx, fl.zz, x2, z2, a, b, c, d);
		}
		return y;
	},
	/**
	* Computes the array index for the given cell coords & checks if they're in
	* bounds. If not an {@link IndexOutOfBoundsException} is thrown.
	* 
	* @param {Number} x
	* @param {Number} z
	* @return {Number} array index
	*/
	getIndex: function(x,z){
		var idx = z * this.width + x;
		if(idx < 0 || idx > this.elevation.length){
			throw new Error("the given terrain cell is invalid: "+x+ ";"+z);
		}
		return idx;
	},
	/**
	 * @return {Vec2D} the scale
	 */
	getScale: function(){
		return this.scale;
	},

	getVertexAtCell: function(x,z){
		return this.vertices[this.getIndex(x,z)];
	},
	/**
	 * @return {Number} number of grid cells along X axis
	 */
	getWidth: function(){
		return this.width;
	},
	/**
	* Computes the 3D position (with elevation) and normal vector at the given
	* 2D location in the terrain. The position is in scaled world coordinates
	* based on the given terrain scale. The returned data is encapsulated in a
	* {@link toxi.geom.IsectData3D} instance.
	* 
	* @param {Number} x
	* @param {Number} z
	* @return {IsectData3D} intersection data parcel
	*/
	intersectAtPoint: function(x,z){
		var xx = x / this.scale.x + this.width * 0.5,
			zz = z / this.scale.y + this._depth * 0.5,
			isec = new IsectData3D();
		if(xx >= 0 && xx < this.width && zz >= 0 && zz < this._depth){
			var x2 = Math.floor(mathUtils.min(xx + 1, this.width - 1)),
				z2 = Math.floor(mathUtils.min(zz + 1, this._depth - 1)),
				fl = {
					xx: Math.floor(xx),
					zz: Math.floor(zz)
				},
				a = this.getVertexAtCell(fl.xx,fl.zz),
				b = this.getVertexAtCell(x2, fl.zz),
				c = this.getVertexAtCell(x2,z2),
				d = this.getVertextAtCell(fl.xx,z2),
				r = new Ray3D(new Vec3D(x, 10000, z), new Vec3D(0, -1, 0)),
				i = new TriangleIntersector(new Triangle3D(a, b, d));
			
			if(i.intersectsRay(r)){
				isec = i.getIntersectionData();
			} else {
				i.setTriangle(new Triangle3D(b, c, d));
				i.intersectsRay(r);
				isec = i.getIntersectionData();
			}
		}
		return isec;
	},
	/**
	* Sets the elevation of all cells to those of the given array values.
	* 
	* @param {Array} elevation array of height values
	* @return itself
	*/
	setElevation: function(elevation){
		if(this.elevation.length == elevation.length){
			for(var i = 0, len = elevation.length; i<len; i++){
				this.vertices[i].y = this.elevation[i] = elevation[i];
			}
		} else {
			throw new Error("the given elevation array size does not match terrain");
		}
		return this;
	},
	/**
	* Sets the elevation for a single given grid cell.
	* 
	* @param {Number} x
	* @param {Number} z
	* @param {Number} h new elevation value
	* @return itself
	*/
	setHeightAtCell: function(x,z,h){
		var index = this.getIndex(x,z);
		this.elevation[index] = h;
		this.vertices[index].y = h;
		return this;
	},
	setScale: function(scale){
		if(!internals.hasProperties(scale,['x','y'])){
			this.scale = new Vec2D(scale,scale);
		} else {
			this.scale = scale;
		}
	}
};