define(["require", "exports", "module", "../internals","./Vec2D","./BernsteinPolynomial"], function(require, exports, module) {

var Vec2D = require('./Vec2D'),
	internals = require('../internals'),
	BernsteinPolynomial = require('./BernsteinPolynomial');

/**
 * @class
 * @member toxi
 * @param {Vec2D[]} points array of Vec2D's
 * @param {BernsteinPolynomial} [bernsteinPoly]
 */
var	Spline2D = function(points, bernsteinPoly, tightness){
	if( arguments.length === 1 && !internals.isArray( points ) && typeof points === 'object' ){
		//if its an options object
		bernsteinPoly = bernsteinPoly || points.bernsteinPoly;
		tightness = tightness || points.tightness;
		points = points.points;
	}
	var i = 0, l;
	this.pointList = [];
	if( typeof tightness !== 'number' ){
		tightness = Spline2D.DEFAULT_TIGHTNESS;
	}
	this.setTightness(tightness);
	//this may be undefined
	this.bernstein = bernsteinPoly;
	if( points !== undefined ){
		for(i = 0, l = points.length; i<l; i++){
			this.add( points[i].copy() );
		}
	}
	this.coeffA = [];
	this.delta = [];
	this.bi = [];
	for (i = 0; i < this.numP; i++) {
		this.coeffA[i] = new Vec2D();
		this.delta[i] = new Vec2D();
		this.bi[i] = 0;
	}
	this.bi = [];
};


Spline2D.prototype = {
	add: function(p){
		this.pointList.push(p.copy());
		this.numP = this.pointList.length;
		return this;
	},

	
	computeVertices: function(res){
		this.updateCoefficients();
		if (this.bernstein === undefined || this.bernstein.resolution != res) {
			this.bernstein = new BernsteinPolynomial(res);
		}
		var bst = this.bernstein;
		this.vertices = [];
		this.findCPoints();
		var deltaP = new Vec2D();
		var deltaQ = new Vec2D();
		for (var i = 0; i < this.numP - 1; i++) {
			var p = this.points[i];
			var q = this.points[i + 1];
			deltaP.set(this.delta[i]).addSelf(p);
			deltaQ.set(q).subSelf(this.delta[i + 1]);
			for (var k = 0; k < bst.resolution; k++) {
				var x = p.x * bst.b0[k] + deltaP.x * bst.b1[k] +
				deltaQ.x * bst.b2[k] +
				q.x * bst.b3[k];
				var y = p.y * bst.b0[k] + deltaP.y * bst.b1[k] +
				deltaQ.y * bst.b2[k] +
				q.y * bst.b3[k];
				this.vertices.push(new Vec2D(x, y));
			}
		}
		return this.vertices;
	},

	findCPoints: function(){
		this.bi[1] = -0.25;
		var i, p0, p2, d0;
		p0 = this.pointList[0];
		p2 = this.pointList[2];
		d0 = this.delta[0];
		this.coeffA[1].set((p2.x - p0.x - d0.x) * this.tightness, (p2.y - p0.y - d0.y) * this.tightness);
		for (i = 2; i < this.numP - 1; i++) {
			this.bi[i] = -1 / (this.invTightness + this.bi[i - 1]);
			this.coeffA[i].set(-(this.points[i + 1].x - this.points[i - 1].x - this.coeffA[i - 1].x) *
			this.bi[i], -(this.points[i + 1].y - this.points[i - 1].y - this.coeffA[i - 1].y) *
			this.bi[i]);
		}
		for (i = this.numP - 2; i > 0; i--) {
			this.delta[i].set(this.coeffA[i].x + this.delta[i + 1].x * this.bi[i], this.coeffA[i].y +
			this.delta[i + 1].y * this.bi[i]);
		}
	},
	
	getDecimatedVertices: function(step,doAddFinalVertex){
		if(doAddFinalVertex === undefined)doAddFinalVertex = true;
		if(this.vertices === undefined || this.vertices.length < 2){
			this.computeVertices(Spline2D.DEFAULT_RES);
		}
		var arcLen = this.getEstimatedArcLength();
		var uniform = [];
		var delta = step / arcLen;
		var currIdx = 0;
		for(var t =0; t<1.0; t+= delta){
			var currT = t * arcLen;
			while(currT >= this.arcLenIndex[currIdx]){
				currIdx++;
			}
			var p = this.vertices[currIdx - 1];
			var q = this.vertices[currIdx];
			var frac = ((currT - this.arcLenIndex[currIdx - 1]) / (this.arcLenIndex[currIdx] - this.arcLenIndex[currIdx - 1]));
			
			var i = p.interpolateTo(q,frac);
			this.uniform.push(i);
		}
		if(doAddFinalVertex){
			uniform.push(this.vertices[this.vertices.length-1]);
		}
		return uniform;
	},
	
	
	getEstimatedArcLength: function(){
		if(this.arcLenIndex === undefined || (this.arcLenIndex !== undefined && this.arcLenIndex.length != this.vertices.length)){
			this.arcLenIndex = [];
		}
		var arcLen = 0;
		for(var i=1;i<this.arcLenIndex.length;i++){
			var p = this.vertices[i-1];
			var q = this.vertices[i];
			arcLen += p.distanceTo(q);
			this.arcLenIndex[i] = arcLen;
		}
		return arcLen;
	},
	
	
	getNumPoints: function(){
		return this.numP;
	},
	
	getPointList: function(){
		return this.pointList;
	},
	
	getTightness: function(){
		return this.tightness;
	},
	
	setPointList: function(plist){
		this.pointList =plist.slice(0);
		return this;
	},
	
	setTightness: function(tight){
		this.tightness = tight;
		this.invTightness = 1 / this.tightness;
		return this;
	},
	
	updateCoefficients: function(){
		this.numP = this.pointList.length;
		if(this.points === undefined || (this.points !== undefined && this.points.length != this.numP)) {
			this.coeffA = [];
			this.delta = [];
			this.bi = [];
			for(var i=0;i<this.numP; i++){
				this.coeffA[i] = new Vec2D();
				this.delta[i] = new Vec2D();
			}
			this.setTightness(this.tightness);
		}
		this.points = this.pointList.slice(0);
	}

};

Spline2D.DEFAULT_TIGHTNESS = 0.25;
Spline2D.DEFAULT_RES = 16;

module.exports = Spline2D;
});
