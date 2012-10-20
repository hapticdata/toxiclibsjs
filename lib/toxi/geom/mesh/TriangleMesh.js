define([
	"require",
	"exports",
	"module",
	"../../internals",
	"../../math/mathUtils",
	"../Matrix4x4",
	"./Face",
	"../Vec3D",
	"../AABB",
	"../Sphere",
	"../Triangle3D",
	"../Quaternion",
	"./Vertex",
	'../Line3D',
	'../Vec2D',
	'./WingedEdge',
	'./subdiv/MidpointSubdivision'
], function(require, exports, module) {
	//these 2 modules get defined
	//WETriangleMesh gets exported as a property on TriangleMesh
	var TriangleMesh, WETriangleMesh;

	//define TriangleMesh
	(function(){
		var	internals = require('../../internals'),
			mathUtils = require('../../math/mathUtils'),
			Matrix4x4 = require('../Matrix4x4'),
			Face = require('./Face'),
			Vec3D = require('../Vec3D'),
			Triangle3D = require('../Triangle3D'),
			Quaternion = require('../Quaternion'),
			Vertex = require('./Vertex');


		function vertexKeyGenerator( v ){
			var precision = 10000;
			var format = function( n ){
				return Math.floor(n*precision) / precision;
			};
			//this will hold the ids consistently between vertex and vec3ds
			return "[ x: "+format(v.x)+ ", y: "+format(v.y)+ ", z: "+format(v.z)+"]";
		}

		/**
		 * @class
		 * @member toxi
		 */
		//java TriangleMesh constructor is (name, numVertices, numFaces)
		//numVertices, numFaces is irrelevant with js arrays
		TriangleMesh = function(name){
			if(name === undefined)name = "untitled";
			this.init( name );
			return this;
		};


		//statics
		TriangleMesh.DEFAULT_NUM_VERTICES = 1000;
		TriangleMesh.DEFAULT_NUM_FACES = 3000;
		TriangleMesh.DEFAULT_STRIDE = 4;

		TriangleMesh.prototype = {
			addFace: function(a,b,c,n,uvA,uvB,uvC){
				//can be 3 args, 4 args, 6 args, or 7 args
				//if it was 6 swap vars around,
				if( arguments.length == 6 ){
					uvC = uvB;
					uvB = uvA;
					uvA = n;
					n = undefined;
				}
				//7 param method
				var va = this.__checkVertex(a);
				var vb = this.__checkVertex(b);
				var vc = this.__checkVertex(c);
			
				if(va.id === vb.id || va.id === vc.id || vb.id === vc.id){
					//console.log("ignoring invalid face: "+a + ", " +b+ ", "+c);
				} else {
					if(n !== undefined){
						var nc = va.sub(vc).crossSelf(va.sub(vb));
						if(n.dot(nc)<0){
							var t = va;
							va = vb;
							vb = t;
						}
					}
					var f = new Face(va,vb,vc,uvA,uvB,uvC);
					//console.log(f.toString());
					this.faces.push(f);
				}
				return this;
			},
			
			addMesh: function(m){
				var l = m.getFaces().length;
				for(var i=0;i<l;i++){
					var f = m.getFaces()[i];
					this.addFace(f.a,f.b,f.c);
				}
				return this;
			},
			
			//if no function is called it is assumed the response is not needed
			center: function(origin){
				this.computeCentroid();
				var delta = (origin !== undefined) ? origin.sub(this.centroid) : this.centroid.getInverted();
				var l = this.vertices.length;
				for(var i=0;i<l;i++){
					var v = this.vertices[i];
					v.addSelf(delta);
				}
				
				return this.getBoundingBox();
			},
			
			__checkVertex: function(v){
				var vertex = this.vertexMap.get(v);
				if(vertex === undefined){
					vertex = this._createVertex(v,this.uniqueVertexID++);
					this.vertexMap.put( vertex, vertex );
				}
				return vertex;
			},
			
			clear: function(){
				this.vertexMap = new internals.LinkedMap( vertexKeyGenerator );
				this.vertices = this.vertexMap.getArray();
				this.faces = [];
				this.bounds = undefined;
				return this;
			},
			
			computeCentroid: function(){
				this.centroid.clear();
				var l = this.vertices.length;
				for(var i=0;i<l;i++){
					this.centroid.addSelf(this.vertices[i]);
				}
				return this.centroid.scaleSelf(1.0/this.vertexMap.size()).copy();
			},
			
			computeFaceNormals: function(){
				var l = this.faces.length;
				for(var i=0;i<l;i++){
					this.faces[i].computeNormal();
				}
			},
			
			computeVertexNormals: function(){
				var l = this.vertices.length,
					i = 0;
				for(i=0;i<l;i++){
					this.vertices[i].clearNormal();
				}
				l = this.faces.length;
				for(i=0;i<l;i++){
					var f = this.faces[i];
					f.a.addFaceNormal(f.normal);
					f.b.addFaceNormal(f.normal);
					f.c.addFaceNormal(f.normal);
				}
				l = this.vertices.length;
				for(i=0;i<l;i++){
					this.vertices[i].computeNormal();
				}
				return this;
			},
			
			copy: function(){
				var m = new TriangleMesh(this.name+"-copy",this.vertexMap.size(),this.faces.length);
				var l = this.faces.length;
				for(var i=0;i<l;i++){
					var f = this.faces[i];
					m.addFace(f.a,f.b,f.c,f.normal,f.uvA,f.uvB,f.uvC);
				}
				return m;
			},
			
			_createVertex: function(vec3D,id){
				var vertex = new Vertex( vec3D, id );
				return vertex;
			},
			
			faceOutwards: function(){
				this.computeCentroid();
				var l = this.faces.length;
				for(var i=0;i<l;i++){
					var f = this.faces[i];
					var n = f.getCentroid().sub(this.centroid);
					var dot = n.dot(f.normal);
					if(dot <0) {
						f.flipVertexOrder();
					}
				}
				return this;
			},
			
			flipVertexOrder: function(){
				var l = this.faces.length;
				for(var i=0;i<l;i++){
					var f = this.faces[i];
					var t = f.a;
					f.a = f.b;
					f.b = t;
					f.normal.invert();
				}
				return this;
			},
			
			flipYAxis: function(){
				this.transform(new Matrix4x4().scaleSelf(1,-1,1));
				this.flipVerteAxOrder();
				return this;
			},
			
			getBoundingBox: function( ){
				/*if( fn === undefined ){
					throw new Error("getBoundingBox() is an async method, provide a callback and the AABB will be the first parameter");
				}*/
				var AABB = require('../AABB');
				var self = this;
				var minBounds = Vec3D.MAX_VALUE.copy();
				var maxBounds = Vec3D.MIN_VALUE.copy();
				var l = self.vertices.length;

				for(var i=0;i<l;i++){
					var v = self.vertices[i];
					minBounds.minSelf(v);
					maxBounds.maxSelf(v);
				}
				self.bounds = AABB.fromMinMax(minBounds,maxBounds);
				return self.bounds;
			},
			
			getBoundingSphere:function(){
				/*if( fn === undefined ){
					throw new Error("getBoundingSphere() is an async method, provide a callback and the Sphere will be the first parameter");
				}*/
				//var self = this;
				var Sphere = require('../Sphere');
				var radius = 0;
				this.computeCentroid();
				var l = this.vertices.length;
				for(var i=0;i<l;i++){
					var v = this.vertices[i];
					radius = mathUtils.max(radius,v.distanceToSquared(this.centroid));
				}
				var sph = new Sphere(this.centroid,Math.sqrt(radius));
				return sph;
			},
			
			getClosestVertexToPoint: function(p){
				var closest,
					minDist = Number.MAX_VALUE,
					l = this.vertices.length;
				for(var i=0;i<l;i++){
					var v = this.vertices[i];
					var d = v.distanceToSquared(p);
					if(d<minDist){
						closest = v;
						minDist = d;
					}
				}
				return closest;
			},
			
			/**
			 * Creates an array of unravelled normal coordinates. For each vertex the
			 * normal vector of its parent face is used. This method can be used to
			 * translate the internal mesh data structure into a format suitable for
			 * OpenGL Vertex Buffer Objects (by choosing stride=4). For more detail,
			 * please see {@link #getMeshAsVertexArray(float[], int, int)}
			 *
			 * @see #getMeshAsVertexArray(float[], int, int)
			 *
			 * @param normals existing float array or null to automatically create one
			 * @param offset start index in array to place normals
			 * @param stride stride/alignment setting for individual coordinates (min value
			 *            = 3)
			 * @return array of xyz normal coords
			 */
			getFaceNormalsAsArray: function(normals, offset, stride) {
				if(arguments.length === 0){
					normals = undefined;
					offset = 0;
					stride = TriangleMesh.DEFAULT_STRIDE;
				} else if(arguments.length == 1 && typeof(arguments[0]) == 'object'){ //options object
					var opts = arguments[0];
					normals = opts.normals;
					offset = opts.offset;
					stride = opts.stride;
				}
				stride = mathUtils.max(stride, 3);
				if (normals === undefined) {
					normals = [];
				}
				var i = offset;
				var l = this.faces.length;
				for (var j=0;j<l;j++) {
					var f = this.faces[j];
					normals[i] = f.normal.x;
					normals[i + 1] = f.normal.y;
					normals[i + 2] = f.normal.z;
					i += stride;
					normals[i] = f.normal.x;
					normals[i + 1] = f.normal.y;
					normals[i + 2] = f.normal.z;
					i += stride;
					normals[i] = f.normal.x;
					normals[i + 1] = f.normal.y;
					normals[i + 2] = f.normal.z;
					i += stride;
				}
				return normals;
			},
			
			getFaces: function() {
				return this.faces;
			},
			
			/**
			 * Builds an array of vertex indices of all faces. Each vertex ID
			 * corresponds to its position in the {@link #vertices} HashMap. The
			 * resulting array will be 3 times the face count.
			 *
			 * @return array of vertex indices
			 */
			getFacesAsArray: function() {
				var faceList = [];
				var i = 0;
				var l = this.faces.length;
				for (var j=0;j<l;j++) {
					var f = this.faces[j];
					faceList[i++] = f.a.id;
					faceList[i++] = f.b.id;
					faceList[i++] = f.c.id;
				}
				return faceList;
			},
			
			getIntersectionData: function() {
				return this.intersector.getIntersectionData();
			},
			
			
			/**
			 * Creates an array of unravelled vertex coordinates for all faces. This
			 * method can be used to translate the internal mesh data structure into a
			 * format suitable for OpenGL Vertex Buffer Objects (by choosing stride=4).
			 * The order of the array will be as follows:
			 *
			 * <ul>
			 * <li>Face 1:
			 * <ul>
			 * <li>Vertex #1
			 * <ul>
			 * <li>x</li>
			 * <li>y</li>
			 * <li>z</li>
			 * <li>[optional empty indices to match stride setting]</li>
			 * </ul>
			 * </li>
			 * <li>Vertex #2
			 * <ul>
			 * <li>x</li>
			 * <li>y</li>
			 * <li>z</li>
			 * <li>[optional empty indices to match stride setting]</li>
			 * </ul>
			 * </li>
			 * <li>Vertex #3
			 * <ul>
			 * <li>x</li>
			 * <li>y</li>
			 * <li>z</li>
			 * <li>[optional empty indices to match stride setting]</li>
			 * </ul>
			 * </li>
			 * </ul>
			 * <li>Face 2:
			 * <ul>
			 * <li>Vertex #1</li>
			 * <li>...etc.</li>
			 * </ul>
			 * </ul>
			 *
			 * @param verts  an existing target array or null to automatically create one
			 * @param offset start index in arrtay to place vertices
			 * @param stride stride/alignment setting for individual coordinates
			 * @return array of xyz vertex coords
			 */
			getMeshAsVertexArray: function(verts, offset, stride) {
				if(verts ===undefined){
					verts = undefined;
				}
				if(offset === undefined){
					offset = 0;
				}
				if(stride === undefined){
					stride = TriangleMesh.DEFAULT_STRIDE;
				}
				stride = mathUtils.max(stride, 3);
				if (verts === undefined) {
					verts = [];
				}
				var i = 0,//offset
					l = this.faces.length;
				for (var j=0;j<l;++j) {
					var f = this.faces[j];
					verts[i] = f.a.x;
					verts[i + 1] = f.a.y;
					verts[i + 2] = f.a.z;
					i += stride;
					verts[i] = f.b.x;
					verts[i + 1] = f.b.y;
					verts[i + 2] = f.b.z;
					i += stride;
					verts[i] = f.c.x;
					verts[i + 1] = f.c.y;
					verts[i + 2] = f.c.z;
					i += stride;
				}
				return verts;
			},
			
			getNumFaces: function() {
				return this.faces.length;
			},
			
			getNumVertices: function() {
				return this.vertexMap.size();
			},
			
			getRotatedAroundAxis: function(axis,theta) {
				return this.copy().rotateAroundAxis(axis, theta);
			},
			
			getRotatedX: function(theta) {
				return this.copy().rotateX(theta);
			},
			
			getRotatedY: function(theta) {
				return this.copy().rotateY(theta);
			},
			
			getRotatedZ: function(theta) {
				return this.copy().rotateZ(theta);
			},
			
			getScaled: function(scale) {
				return this.copy().scale(scale);
			},
			
			getTranslated: function(trans) {
				return this.copy().translate(trans);
			},
			
			getUniqueVerticesAsArray: function() {
				var verts = [];
				var i = 0;
				var l = this.vertices.length;
				for (var j=0;i<l;j++) {
					var v = this.vertices[j];
					verts[i++] = v.x;
					verts[i++] = v.y;
					verts[i++] = v.z;
				}
				return verts;
			},
			
			getVertexAtPoint: function(v) {
				var index;
				for(var i=0;i<this.vertices.length;i++){
					if(this.vertices[i].equals(v)){
						index = i;
					}
				}
				return this.vertices[index];
			},
			//my own method to help
			getVertexIndex: function(vec) {
				var matchedVertex = -1;
				var l = this.vertices.length;
				for(var i=0;i<l;i++)
				{
					var vert = this.vertices[i];
					if(vert.equals(vec))
					{
						matchedVertex =i;
					}
				}
				return matchedVertex;
			
			},
			
			getVertexForID: function(id) {
				var vertex,
					l = this.vertices.length;
				for (var i=0;i<l;i++) {
					var v = this.vertices[i];
					if (v.id == id) {
						vertex = v;
						break;
					}
				}
				return vertex;
			},
			
			/**
			 * Creates an array of unravelled vertex normal coordinates for all faces.
			 * This method can be used to translate the internal mesh data structure
			 * into a format suitable for OpenGL Vertex Buffer Objects (by choosing
			 * stride=4). For more detail, please see
			 * {@link #getMeshAsVertexArray(float[], int, int)}
			 *
			 * @see #getMeshAsVertexArray(float[], int, int)
			 *
			 * @param normals existing float array or null to automatically create one
			 * @param offset start index in array to place normals
			 * @param stride stride/alignment setting for individual coordinates (min value
			 *            = 3)
			 * @return array of xyz normal coords
			 */
			getVertexNormalsAsArray: function(normals, offset,stride) {
				if(offset === undefined)offset = 0;
				if(stride === undefined)stride = TriangleMesh.DEFAULT_STRIDE;
				stride = mathUtils.max(stride, 3);
				if (normals === undefined) {
					normals = [];
				}
				var i = offset;
				var l = this.faces.length;
				for (var j=0;j<l;j++) {
					var f = this.faces[j];
					normals[i] = f.a.normal.x;
					normals[i + 1] = f.a.normal.y;
					normals[i + 2] = f.a.normal.z;
					i += stride;
					normals[i] = f.b.normal.x;
					normals[i + 1] = f.b.normal.y;
					normals[i + 2] = f.b.normal.z;
					i += stride;
					normals[i] = f.c.normal.x;
					normals[i + 1] = f.c.normal.y;
					normals[i + 2] = f.c.normal.z;
					i += stride;
				}
				return normals;
			},
			
			getVertices: function() {
				return this.vertices;
			},
			
			handleSaveAsSTL: function(stl,useFlippedY) {
				/*f (useFlippedY) {
					stl.setScale(new Vec3D(1, -1, 1));
					for (Face f : faces) {
						stl.face(f.a, f.b, f.c, f.normal, STLWriter.DEFAULT_RGB);
					}
				} else {
					for (Face f : faces) {
						stl.face(f.b, f.a, f.c, f.normal, STLWriter.DEFAULT_RGB);
					}
				}
				stl.endSave();
				console.log(numFaces + " faces written");
				*/
				throw Error("TriangleMesh.handleSaveAsSTL() currently not implemented");
			
			},

			init: function( name ){
				this.setName(name);
				this.matrix = new Matrix4x4();
				this.centroid = new Vec3D();
				this.vertexMap = new internals.LinkedMap( vertexKeyGenerator );
				//used for checking if theres an existing Vertex
				this.vertices = this.vertexMap.getArray();
				this.faces = [];
				this.uniqueVertexID = 0;
			},
			
			//FIXME this.intersector needs implementing of TriangleIntersector
			intersectsRay: function(ray) {
				throw Error('intersectsRay not yet implemented');
				/*var tri = this.intersector.getTriangle();
				var l = this.faces.length;
				var f;
				for (var i =0;i<l;i++) {
					f = this.faces[i];
					tri.a = f.a;
					tri.b = f.b;
					tri.c = f.c;
					if (this.intersector.intersectsRay(ray)) {
						return true;
					}
				}
				return false;*/
			},
			
			perforateFace: function(f, size) {
				var centroid = f.getCentroid();
				var d = 1 - size;
				var a2 = f.a.interpolateTo(centroid, d);
				var b2 = f.b.interpolateTo(centroid, d);
				var c2 = f.c.interpolateTo(centroid, d);
				this.removeFace(f);
				this.addFace(f.a, b2, a2);
				this.addFace(f.a, f.b, b2);
				this.addFace(f.b, c2, b2);
				this.addFace(f.b, f.c, c2);
				this.addFace(f.c, a2, c2);
				this.addFace(f.c, f.a, a2);
				return new Triangle3D(a2, b2, c2);
			},
			
			/**
			 * Rotates the mesh in such a way so that its "forward" axis is aligned with
			 * the given direction. This version uses the positive Z-axis as default
			 * forward direction.
			 *
			 * @param dir, new target direction to point in
			 * @param [forward], optional vector, defaults to Vec3D.Z_AXIS
			 * @return itself
			 */
			pointTowards: function(dir, forward) {
				forward = forward || Vec3D.Z_AXIS;
				return this.transform( Quaternion.getAlignmentQuat(dir, forward).toMatrix4x4(this.matrix), true);
			},
			
			removeFace: function(f) {
				var index = -1;
				var l = this.faces.length;
				for(var i=0;i<l;i++){
					if(this.faces[i] == f){
						index = i;
						break;
					}
				}
				if(index > -1){
					this.faces.splice(index,1);
				}
			},
			
			
			rotateAroundAxis: function(axis, theta) {
				return this.transform(this.matrix.identity().rotateAroundAxis(axis, theta));
			},
			
			rotateX: function(theta) {
				return this.transform(this.matrix.identity().rotateX(theta));
			},
			
			rotateY: function(theta) {
				return this.transform(this.matrix.identity().rotateY(theta));
			},
			
			rotateZ: function(theta) {
				return this.transform(this.matrix.identity().rotateZ(theta));
			},
			
			saveAsOBJ: function(obj, saveNormals) {
				if( saveNormals === undefined){
					saveNormals = true;
				}
				var vOffset = obj.getCurrVertexOffset() + 1,
					nOffset = obj.getCurrNormalOffset() + 1;
				obj.newObject( this.name );
				//vertices
				var v = 0, f = 0,
					vlen = this.vertices.length,
					flen = this.faces.length,
					face;
				for( v=0; v<vlen; v++ ){
					obj.vertex( this.vertices[v] );
				}
				//faces
				if( saveNormals ){
					//normals
					for( v=0; v<vlen; v++){
						obj.normal( this.vertices[v].normal );
					}
					for( f=0; f<flen; f++){
						face = this.faces[f];
						obj.faceWithNormals(face.b.id + vOffset, face.a.id + vOffset, face.c.id + vOffset, face.b.id + nOffset, face.a.id + nOffset, face.c.id + nOffset);
					}
				} else {
					for( f=0; f<flen; f++){
						face = this.faces[f];
						obj.face(face.b.id + vOffset, face.a.id + vOffset, face.c.id + vOffset);
					}
				}
			},
			
			saveAsSTL: function(a,b,c){
				throw Error("TriangleMesh.saveAsSTL() currently not implemented");
			},
			
			scale: function(scale) {
				return this.transform(this.matrix.identity().scaleSelf(scale));
			},
			
			setName: function(name) {
				this.name = name;
				return this;
			},
			
			toString: function() {
				return "TriangleMesh: " + this.name + " vertices: " + this.getNumVertices() + " faces: " + this.getNumFaces();
			},
			
			toWEMesh: function() {
				return new WETriangleMesh(this.name).addMesh(this);
			},
			
			/**
			* Applies the given matrix transform to all mesh vertices. If the
			* updateNormals flag is true, all face normals are updated automatically,
			* however vertex normals need a manual update.
			* @param mat
			* @param updateNormals
			* @return itself
			*/
			transform: function(mat,updateNormals) {
				if(updateNormals === undefined){
					updateNormals = true;
				}
				var l = this.vertices.length;
				for(var i=0;i<l;i++){
					var v = this.vertices[i];
					v.set(mat.applyTo(v));
				}
				if(updateNormals){
					this.computeFaceNormals();
				}
				return this;
			},

			translate: function(x,y,z){
				if(arguments.length == 1){
					y = x.y;
					z = x.z;
					x = x.x;
				}
				return this.transform(this.matrix.identity().translateSelf(x,y,z));
			},
			
			updateVertex: function(origVec3D,newPos) {
				var vertex = this.vertexMap.get( origVec3D );
				if (vertex !== undefined ) {
					this.vertexMap.remove( vertex );
					vertex.set( newPos );
					this.vertexMap.put( newPos, vertex );
				}
				return this;
			}
		};

		TriangleMesh.__vertexKeyGenerator = vertexKeyGenerator;
	}());

	//define WETriangleMesh
	(function(){
		//dependenecies
		var internals = require('../../internals');
		var Line3D = require('../Line3D');
		var Vec3D = require('../Vec3D');
		var WEVertex = require('./Vertex').WEVertex;
		var WEFace = require('./Face').WEFace;
		var WingedEdge = require('./WingedEdge');
		var MidpointSubdivision = require('./subdiv/MidpointSubdivision');
		
		//locals
		var proto;
		//used for tracking edges in the internals.LinkedMap
		function edgeKeyGenerator( edge ){
			return Line3D.prototype.toString.call( edge );
		}
		//constructor
		WETriangleMesh = function( name ){
			name = name || "untitled";
			TriangleMesh.call(this, name);
		};
		//passing these on to match java api
		WETriangleMesh.DEFAULT_NUM_FACES = TriangleMesh.DEFAULT_NUM_FACES;
		WETriangleMesh.DEFAULT_NUM_VERTICES = TriangleMesh.DEFAULT_NUM_VERTICES;
		
		internals.extend( WETriangleMesh, TriangleMesh );
		proto = WETriangleMesh.prototype;

		proto.addFace = function( a, b, c, norm, uvA, uvB, uvC ){
			if( arguments.length === 6 ){
				//6-arg a,b,c,uvA,uvB,uvC pass everything up one
				uvC = uvB;
				uvB = uvA;
				uvA = norm;
				norm = undefined;
			}

			var va = this.__checkVertex(a),
				vb = this.__checkVertex(b),
				vc = this.__checkVertex(c),
				nc, t, f;

			if( va.id === vb.id || va.id === vc.id || vb.id === vc.id ){
				console.log('Ignoring invalid face: ' + a + ',' + b + ',' + c);
			} else {
				if( norm !== undefined && norm !== null ){
					nc = va.sub(vc).crossSelf(va.sub(vb));
					if( norm.dot(nc) < 0 ){
						t = va;
						va = vb;
						vb = t;
					}
				}
				f = new WEFace(va, vb, vc, uvA, uvB, uvC);
				this.faces.push(f);
				this.updateEdge( va,vb,f );
				this.updateEdge( vb,vc,f );
				this.updateEdge( vc,va,f );
			}
			return this;
		};

		proto.center = function( origin, callback ){
			TriangleMesh.prototype.center.call(this, origin, callback);
			this.rebuildIndex();
		};

		proto.clear = function(){
			TriangleMesh.prototype.clear.call(this);
			this.edgeMap = new internals.LinkedMap( edgeKeyGenerator );
			this.edges = this.edgeMap.getArray();
			return this;
		};

		proto.copy = function(){
			var m = new WETriangleMesh( this.name+"-copy" );
			var i, l, f;
			l = this.faces.length;
			for(i=0; i<l; i++){
				f = this.faces[i];
				m.addFace( f.a, f.b, f.c, f.normal, f.uvA, f.uvB, f.uvC );
			}
			return m;
		};

		proto._createVertex = function( vec3D, id ){
			var vertex = new WEVertex( vec3D, id );
			return vertex;
		};
		//TODO: numEdges currently not hooked up
		proto.getNumEdges = function(){
			return this.edgeMap.size();
		};

		proto.init = function( name ){
			TriangleMesh.prototype.init.call(this, name);
			//this.edgeMap.put(va.toString()+vb.toString(), {WingedEdge} );
			this.edgeMap = new internals.LinkedMap( edgeKeyGenerator );
			this.edges = this.edgeMap.getArray();
			this.__edgeCheck = new Line3D( new Vec3D(), new Vec3D() );
			this.__uniqueEdgeID = 0;
		};

		proto.rebuildIndex = function(){
			//if vertices have moved / transformed a new vertexMap and edgeMap must be made
			//in order to have updated string keys of new positions
			//newVertexDictionary[{String}] = {Vertex}
			var newVertexMap = new internals.LinkedMap( TriangleMesh.__vertexKeyGenerator );
			var newEdgeMap = new internals.LinkedMap( edgeKeyGenerator );

			this.vertexMap.each(function( vertex ){
				newVertexMap.put( vertex, vertex );
			});
			this.edgeMap.each(function( edge ){
				newEdgeMap.put( edge, edge );
			});

			this.vertexMap = newVertexMap;
			this.vertices = newVertexMap.getArray();
			this.edgeMap = newEdgeMap;
			this.edges = newEdgeMap.getArray();
		};

		proto.removeEdge = function( edge ){
			var self = this;
			edge.remove();
			var v = edge.a;
			if( v.edges.length === 0 ){
				this.vertexMap.remove( v );
			}
			v = edge.b;
			if( v.edges.length === 0 ){
				this.vertexMap.remove( v );
			}
			internals.each(edge.faces, function( face ){
				self.removeFace( face );
			});
			var removed = this.edgeMap.remove( this.__edgeCheck.set( edge.a, edge.b ) );
			if( removed !== edge ){
				throw Error("Can't remove edge");
			}
		};

		proto.removeFace = function( face ){
			var self = this;
			var i = this.faces.indexOf( face );
			if( i > -1 ){
				this.faces.splice( i, 1 );
			}
			internals.each( face.edges, function( edge ){
				edge.faces.splice( edge.faces.indexOf(face), 1 );
				if( edge.faces.length === 0 ){
					self.removeEdge( edge );
				}
			});
		};

		//FIXME (FIXME in original java source)
		//TODO UNIT TEST .splice
		proto.removeUnusedVertices = function(){
			internals.each( this.vertices, function( vertex, i ){
				var isUsed = false;
				internals.each( this.faces, function( f ){
					if( f.a == vertex || f.b == vertex || f.c == vertex ){
						isUsed = true;
						return;
					}
				});
				if( !isUsed ){
					this.vertices.splice( i, 1 );
				}
			});
		};

		/**
		* @param {Vertex[] | Vertex{}} selection, array or object of Vertex's to remove
		*/
		proto.removeVertices = function( selection ){
			internals.each( selection, function( vertex ){
				//WingedEdgeVertex
				internals.each( vertex.edges, function( edge ){
					internals.each( edge.faces, function( face ){
						this.removeFace( face );
					});
				});
			});
		};

		//@param {Vec3D | WingedEdge} a or edge
		//@param {Vec3D | SubdivisionStrategy} b or strategy if edge supplied
		//@param {SubdivisionStrategy} [subDiv] or undefined
		proto.splitEdge = function( a, b, subDiv ){
			var edge, mid;
			if( arguments.length === 3 ){
				edge = this.edgeMap.get( this.__edgeCheck.set(a, b) );
			} else if( arguments.length == 2 ){
				edge = a;
				subDiv = b;
			}
			mid = subDiv.computeSplitPoints( edge );
			this.splitFace( edge.faces[0], edge, mid);
			if( edge.faces.length > 1 ){
				this.splitFace( edge.faces[1], edge, mid);
			}
			this.removeEdge( edge );
		};
		//@param {WEFace} face,
		//@param {WingedEdge} edge,
		//@param {Vec3D[]} midPoints
		proto.splitFace = function( face, edge, midPoints ){
			var p, i, ec, prev, num, mid;
			for(i=0; i<3; i++){
				ec = face.edges[i];
				if( !ec.equals(edge) ){
					if( ec.a.equals(edge.a) || ec.a.equals(edge.b) ){
						p = ec.b;
					} else {
						p = ec.a;
					}
					break;
				}
			}
			num = midPoints.length;
			for(i=0; i<num; i++){
				mid = midPoints[i];
				if( i === 0 ){
					this.addFace( p, edge.a, mid, face.normal );
				} else {
					this.addFace( p, prev, mid, face.normal );
				}
				if( i === num-1 ){
					this.addFace( p, mid, edge.b, face.normal );
				}
				prev = mid;
			}
		};

		//@param {SubdivisionStrategy | Number} subDiv or minLength
		//@param {Number} [minLength] if also supplying subDiv
		proto.subdivide = function( subDiv, minLength ){
			if( arguments.length === 1 ){
				minLength = subDiv;
				subDiv = new MidpointSubdivision();
			}
			this.subdivideEdges( this.edges.slice(0), subDiv, minLength);
		};

		proto.subdivideEdges = function( origEdges, subDiv, minLength ){
			origEdges.sort( subDiv.getEdgeOrdering() );
			minLength *= minLength;
			var i=0, l = origEdges.length;
			for(i=0; i<l; i++){
				var e = origEdges[i];
				if( this.edges.indexOf( e ) > -1 ) {
					if( e.getLengthSquared() >= minLength ) {
						this.splitEdge( e, subDiv );
					}
				}
			}
		};

		proto.subdivideFaceEdges = function( faces, subDiv, minLength ){
			var fedges = [], i,j, f, e, fl, el;
			fl = this.faces.length;
			for(i=0; i<fl; i++){
				f = this.faces[i];
				el = f.edges.length;
				for(j=0; j<el; j++){
					e = f.edges[j];
					if( fedges.indexOf(e) < 0 ){
						fedges.push( e );
					}
				}
			}
			this.subdividEdges( fedges, subDiv, minLength );
		};

		proto.toString = function(){
			return "WETriangleMesh: " + this.name + " vertices: " + this.getNumVertices() + " faces: " + this.getNumFaces() + " edges:" + this.getNumEdges();
		};

		/**
		* Applies the given matrix transform to all mesh vertices. If the
		* updateNormals flag is true, all face normals are updated automatically,
		* however vertex normals still need a manual update.
		* @param {toxi.geom.Matrix4x4} matrix
		* @param {Boolean} [updateNormals]
		*/
		proto.transform = function( matrix, updateNormals ){
			if( updateNormals === undefined || updateNormals === null ){
				updateNormals = true;
			}
			for(var i=0, l = this.vertices.length; i<l; i++){
				matrix.applyToSelf( this.vertices[i] );
			}
			this.rebuildIndex();
			if( updateNormals ){
				this.computeFaceNormals();
			}
			return this;
		};

		proto.updateEdge = function( va, vb, face ){
			//dictionary key is va.toString() + vb.toString() 
			//because Line3D toString would be different than WingedEdge toString()
			this.__edgeCheck.set( va, vb );
			var e = this.edgeMap.get( this.__edgeCheck );
			if( e !== undefined ){
				e.addFace( face );
			} else {
				e = new WingedEdge( va, vb, face, this.__uniqueEdgeID++ );
				this.edgeMap.put( e, e );
				va.addEdge( e );
				vb.addEdge( e );
			}
			face.addEdge( e );
		};
	}());

	TriangleMesh.WETriangleMesh = WETriangleMesh;
	module.exports = TriangleMesh;

});
