define([
	'require',
	'exports',
	'module',
	'./vectors',
	'./Line3D',
	'../internals/has',
	'../internals/Iterator'
], function( require, exports, module ){

	var Vec3D = require('./vectors').Vec3D,
		Line3D = require('./Line3D'),
		hasXYZ = require('../internals/has').XYZ,
		Iterator = require('../internals/Iterator');

	/**
	* construct a LineStrip3D
	* @constructor
	* @param {Vec3D[]} [vertices] optional vertices to start with
	*/
	var LineStrip3D = function( vertices ){
		this.vertices = vertices || [];
	};

	LineStrip3D.prototype = {
		constructor: LineStrip3D,
		/**
		* add a vector to the line-strip, it will always be a copy
		* @param {Vec3D | Number } x either a Vec3D or an x coordinate
		* @param {Number} [y]
		* @param {Number} [z]
		* @return itself
		*/
		add: function( x, y, z ){
			if( hasXYZ( x ) ){
				//it was 1 param, it was a vector or object
				this.vertices.push( new Vec3D(x) );
			} else {
				this.vertices.push( new Vec3D(x,y,z) );
			}
			return this;
		},
		get: function( i ){
			if( i < 0 ){
				i += this.vertices.length;
			}
			return this.vertices[i];
		},
		/**
		* Computes a list of points along the spline which are uniformly separated
		* by the given step distance.
		*
		* @param {Number} step
		* @param {Boolean} [doAddFinalVertex] true by default
		* @return {Vec3D[]} point list
		*/
		getDecimatedVertices: function( step, doAddFinalVertex ){
			if( doAddFinalVertex !== false ){
				doAddFinalVertex = true;
			}
			var uniform = [];
			if( this.vertices.length < 3 ){
				if( this.vertices.length === 2 ){
					new Line3D( this.vertices[0], this.vertices[1])
						.splitIntoSegments( uniform, step, true );
					if( !doAddFinalVertex ){
						uniform.pop();
					}
				} else {
					return;
				}
			}
			var arcLen = this.getEstimatedArcLength(),
				delta = step / arcLen,
				currIdx = 0,
				currT,
				t,
				p,
				q,
				frac,
				i;

			for( t = 0; t<1.0; t+=delta ){
				currT = t * arcLen;
				while( currT >= this.arcLenIndex[currIdx] ){
					currIdx++;
				}
				p = this.get(currIdx-1);
				q = this.get(currIdx);
				frac = ((currT-this.arcLenIndex[currIdx-1]) / (this.arcLenIndex[currIdx] - this.arcLenIndex[currIdx-1]) );
				i = p.interpolateTo( q, frac );
				uniform.push( i );
			}
			if( doAddFinalVertex ){
				uniform.push( this.get(-1).copy() );
			}
			return uniform;
		},
		getEstimatedArcLength: function(){
			if( this.arcLenIndex === undefined || this.arcLenIndex.length !== this.vertices.length ){
				this.arcLenIndex = [0];
			}
			var arcLen = 0,
				p,
				q;
			for( var i=1, l = this.vertices.length; i<l; i++){
				p = this.vertices[i-1];
				q = this.vertices[i];
				arcLen += p.distanceTo(q);
				//this will start at index 1
				this.arcLenIndex[i] = arcLen;
			}
			return arcLen;
		},
		getSegments: function(){
			var i = 1,
				num = this.vertices.length,
				segments = [];
			for( ; i<num; i++ ){
				segments.push( new Line3D(this.get(i-1), this.get(i)) );
			}
			return segments;
		},
		getVertices: function(){
			return vertices;
		},
		iterator: function(){
			return new Iterator( this.vertices );
		},
		setVertices: function( vertices ){
			this.vertices = vertices;
		}
	};

	module.exports = LineStrip3D;
});
