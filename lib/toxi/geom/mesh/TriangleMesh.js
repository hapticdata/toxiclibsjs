define(["require", "exports", "module", "../../math/mathUtils","../Matrix4x4","./Face","../Vec3D","../Triangle3D","../Quaternion","./Vertex"], function(require, exports, module) {

var	mathUtils = require('../../math/mathUtils'),
	Matrix4x4 = require('../Matrix4x4'),
	Face = require('./Face'),
	Vec3D = require('../Vec3D'),
	Triangle3D = require('../Triangle3D'),
	Quaternion = require('../Quaternion'),
	Vertex = require('./Vertex');


/**
 * @class
 * @member toxi
 */
var	TriangleMesh = function(name,numV,numF){
	if(name === undefined)name = "untitled";
	if(numV === undefined)numV = TriangleMesh.DEFAULT_NUM_VERTICES;
	if(numF === undefined)numF = TriangleMesh.DEFAULT_NUM_FACES;
	this.setName(name);
	this.matrix = new Matrix4x4();
	this.centroid = new Vec3D();
	this.vertices = [];
	this.__verticesObject = {};
	this.faces = [];
	this.numVertices = 0;
	this.numFaces = 0;
	this.uniqueVertexID = 0;
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
			this.numFaces++;
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
	
	center: function(origin){
		this.computeCentroid();
		var delta = (origin !== undefined) ? origin.sub(this.centroid) : this.centroid.getInverted();
		var l = this.vertices.length;
		for(var i=0;i<l;i++){
			var v = this.vertices[i];
			v.addSelf(delta);
		}
		this.getBoundingBox();
		return this.bounds;
	},
	
	__checkVertex: function(v){
		var vString = v.toString();
		var vertex = this.__verticesObject[vString];
		if(vertex === undefined){
			vertex = this.createVertex(v,this.uniqueVertexID++);
			this.__verticesObject[vString] = vertex;
			this.vertices.push(vertex);
			this.numVertices++;
		}
		return vertex;
	},
	
	clear: function(){
		this.vertices = [];
		this.faces = [];
		this.bounds = undefined;
		this.numVertices = 0;
		this.numFaces = 0;
		return this;
	},
	
	computeCentroid: function(){
		this.centroid.clear();
		var l = this.vertices.length;
		for(var i=0;i<l;i++){
			this.centroid.addSelf(this.vertices[i]);
		}
		return this.centroid.scaleSelf(1.0/this.numVertices).copy();
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
			f.a.addFaceNormal(f);
			f.b.addFaceNormal(f);
			f.c.addFaceNormal(f);
		}
		l = this.vertices.length;
		for(i=0;i<l;i++){
			this.vertices[i].computeNormal();
		}
		return this;
	},
	
	copy: function(){
		var m = new TriangleMesh(this.name+"-copy",this.numVertices,this.numFaces);
		var l = this.faces.length;
		for(var i=0;i<l;i++){
			var f = this.faces[i];
			m.addFace(f.a,f.b,f.c,f.normal,f.uvA,f.uvB,f.uvC);
		}
		return m;
	},
	
	createVertex: function(v,id){
		return new Vertex(v,id);
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
		this.flipVertexOrder();
		return this;
	},
	
	getBoundingBox:function( fn ){
		if( fn === undefined ){
			throw new Error("getBoundingBox() is an async method, provide a callback and the AABB will be the first parameter");
			return;
		}
		var self = this;
		require(['../AABB'], function( AABB ){
			var minBounds = Vec3D.MAX_VALUE.copy();
			var maxBounds = Vec3D.MIN_VALUE.copy();
			var l = self.vertices.length;

			for(var i=0;i<l;i++){
				var v = self.vertices[i];
				minBounds.minSelf(v);
				maxBounds.maxSelf(v);
			}
			self.bounds = AABB.fromMinMax(minBounds,maxBounds);
			fn( self.bounds );
		});
	},
	
	getBoundingSphere:function( fn ){
		if( fn === undefined ){
			throw new Error("getBoundingSphere() is an async method, provide a callback and the Sphere will be the first parameter");
			return;
		}
		var self = this;
		require(['../Sphere'], function(Sphere){
			var radius = 0;
			self.computeCentroid();
			var l = self.vertices.length;
			for(var i=0;i<l;i++){
				var v = self.vertices[i];
				radius = mathUtils.max(radius,v.distanceToSquared(self.centroid));
			}
			var sph = new Sphere(self.centroid,Math.sqrt(radius));
			fn( sph );
		});
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
	 * @param normals
	 *            existing float array or null to automatically create one
	 * @param offset
	 *            start index in array to place normals
	 * @param stride
	 *            stride/alignment setting for individual coordinates (min value
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
	 * @param verts
	 *            an existing target array or null to automatically create one
	 * @param offset
	 *            start index in arrtay to place vertices
	 * @param stride
	 *            stride/alignment setting for individual coordinates
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
		return this.numFaces;
	},
	
	getNumVertices: function() {
		return this.numVertices;
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
		var index = -1;
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
	 * @param normals
	 *            existing float array or null to automatically create one
	 * @param offset
	 *            start index in array to place normals
	 * @param stride
	 *            stride/alignment setting for individual coordinates (min value
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
		console.log("TriangleMesh.handleSaveAsSTL() currently not implemented");
	
	},
	
	
	intersectsRay: function(ray) {
		var tri = this.intersector.getTriangle();
		var l = this.faces.length;
		for (var i =0;i<l;i++) {
			tri.a = f.a;
			tri.b = f.b;
			tri.c = f.c;
			if (this.intersector.intersectsRay(ray)) {
				return true;
			}
		}
		return false;
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
	 * @param dir
	 *            new target direction to point in
	 * @return itself
	 */
	pointTowards: function(dir) {
		return this.transform( Quaternion.getAlignmentQuat(dir, Vec3D.Z_AXIS).toMatrix4x4(), true);
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
		var v = 0,
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
		console.log("TriangleMesh.saveAsSTL() currently not implemented");
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
	  /*  return new WETriangleMesh(name, vertices.size(), faces.size())
				.addMesh(this);
	   */
	   console.log("TriangleMesh.toWEMesh() currently not implemented");
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
	
	updateVertex: function(orig,newPos) {
		var vi = this.getVertexIndex(orig);
		if (vi > -1) {
			this.vertices.splice(v,1);
			this.vertices[vi].set(newPos);
			this.vertices.push(v);
		}
		return this;
	}
};

exports.TriangleMesh = TriangleMesh;
module.exports = TriangleMesh;

});
