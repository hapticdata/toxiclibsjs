/**
 * Implementation of a 2D grid based heightfield with basic intersection
 * features and conversion to {@link TriangleMesh}. The terrain is always
 * located in the XZ plane with the positive Y axis as up vector.
 */
define([
	'../../internals',
	'../../math/mathUtils',
	'../../math/Interpolation2D',
	'../Ray3D',
	'../TriangleIntersector',
	'../Triangle3D',
	'../IsectData3D',
	'../../geom/Vec2D',
	'../../geom/Vec3D',
	'./TriangleMesh'
], function(internals, mathUtils, Interpolation2D, Ray3D, TriangleIntersector, Triangle3D, IsectData3D, Vec2D, Vec3D, TriangleMesh){

	/**
	* Constructs a new and initially flat terrain of the given size in the XZ
	* plane, centred around the world origin.
	* 
	* @param {Number} width
	* @param {Number} depth
	* @param {toxi.geom.Vec2D | Number} scale
	*/
	var Terrain = function(width, depth, scale){
		this.width = width;
		this._depth = depth;
		if(!internals.hasProperties(scale,['x','y'])){
			this.scale = new Vec2D(scale,scale);
		} else {
			this.scale = scale;
		}
		this.elevation = [];
		var i = 0,
			len = width * depth;
		for(i=0; i<len; i++){
			this.elevation[i] = 0;
		}

		this.__elevationLength = this.width * this._depth;
		this.vertices = [];
		var offset = new Vec3D(parseInt(this.width / 2,10), 0, parseInt(this._depth / 2,10)),
			scaleXZ = this.scale.to3DXZ();
		for(var z = 0, i =0; z < this._depth; z++){
			for(var x = 0; x < this.width; x++){
				this.vertices[i++] = new Vec3D(x,0,z).subSelf(offset).scaleSelf(scaleXZ);
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
			console.log("["+x+","+z+"]");
			return this.elevation[this._getIndex(x,z)];
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
				y = 0,
				fl = {
					xx: parseInt(xx,10),
					zz: parseInt(zz,10)
				};
			if(xx >= 0 & xx < this.width && zz >= 0 && zz < this._depth){
				
				var x2 = parseInt(mathUtils.min(xx + 1, this.width - 1), 10),
					z2 = parseInt(mathUtils.min(zz + 1, this._depth - 1), 10);

				var	a = this.getHeightAtCell(fl.xx, fl.zz),
					b = this.getHeightAtCell(x2, fl.zz),
					c = this.getHeightAtCell(fl.xx, z2),
					d = this.getHeightAtCell(x2, z2);
				
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
		_getIndex: function(x,z){
			var idx = z * this.width + x;
			if(idx < 0 || idx > this.__elevationLength){
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
			return this.vertices[this._getIndex(x,z)];
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
				var x2 = parseInt(mathUtils.min(xx + 1, this.width - 1),10),
					z2 = parseInt(mathUtils.min(zz + 1, this._depth - 1),10),
					fl = {
						xx: parseInt(xx,10),
						zz: parseInt(zz,10)
					},
					a = this.getVertexAtCell(fl.xx,fl.zz),
					b = this.getVertexAtCell(x2, fl.zz),
					c = this.getVertexAtCell(x2,z2),
					d = this.getVertexAtCell(fl.xx,z2),
					r = new Ray3D(new Vec3D(x, 10000, z), new Vec3D(0, -1, 0)),
					i = new TriangleIntersector(new Triangle3D(a, b, d));
				
				console.log("ray",r);
				console.log("intersector",i);

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
			if(this.__elevationLength == elevation.length){
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
			var index = this._getIndex(x,z);
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
		},
		toMesh: function(){
			var opts = {
				mesh: undefined,
				minX: 0,
				minZ: 0,
				maxX: this.width,
				maxZ: this._depth
			};

			var v = this.vertices,
				w = this.width,
				d = this._depth;

			if(arguments.length == 1 && typeof arguments[0] == 'object'){
				//options object
				var args = arguments[0];
				opts.mesh = args.mesh || new TriangleMesh("terrain");
				opts.minX = args.minX || opts.minX;
				opts.minZ = args.minZ || opts.minZ;
				opts.maxX = args.maxX || opts.maxX;
				opts.maxZ = args.maxZ || opts.maxZ;
			} else if(arguments.length >= 5){
				opts.mesh = arguments[0];
				opts.minX = arguments[1];
				opts.minZ = arguments[2];
				opts.maxX  = arguments[3];
				opts.maxZ = arguments[4];
			}

			opts.mesh = opts.mesh || new TriangleMesh("terrain");
			opts.minX = mathUtils.clip(opts.minX, 0, w - 1);
			opts.maxX = mathUtils.clip(opts.maxX, 0, w);
			opts.minZ = mathUtils.clip(opts.minZ, 0, d-1);
			opts.maxZ = mathUtils.clip(opts.maxZ, 0, d);
			opts.minX++;
			opts.minZ++;


			for(var z = opts.minZ, idx = opts.minX * w; z < opts.maxZ; z++, idx += w){
				for(var x = opts.minX; x < opts.maxX; x++){
					opts.mesh.addFace(v[idx - w + x - 1], v[idx - w + x], v[idx + x - 1]);
					opts.mesh.addFace(v[idx - w + x], v[idx + x], v[idx + x - 1]);
				}
			}
			return opts.mesh;
		}
	};

	return	Terrain;
});