define([
	'../../internals'
], function( internals ){
	
	var OBJWriter = function(){
		this.VERSION = "0.3";
		this.__bufferString = "";
		this.objStream;
		this.__filename = "objwriter.obj";
		this._numVerticesWritten = 0;
		this._numNormalsWritten = 0;
	};


	OBJWriter.prototype = {
		/**
		 * begin saving
		 * @param {WritableStream | String} [stream] stream can be a node.js WritableStream, or it can be a filename or undefined
		 */
		beginSave: function( stream ){
			if( typeof stream == 'string' ){

			} else if( internals.hasProperties(stream,['write','end','writable'] && stream.writable)){
				this.objStream = stream;
				this._handleBeginSave();
			} else {

			}
		},

		endSave: function(){
			if(this.objStream !== undefined ){
				try {
					this.objStream.destroy();
				} catch( e ){

				}
			}
		},

		face: function( a, b, c ){
			this.__bufferString += "f " + a + " " + b + " " + c + "\n";
		},

		faceList: function(){
			this.__bufferString += "s off \n";
		},

		faceWithNormals: function( a, na, b, nb, c, nc ){
			this.__bufferString += "f " + a + "//" + na + " " + b + "//" + nb + " " + c + "//" + nc + "\n";
		},

		getCurrNormalOffset: function(){
			return this._numNormalsWritten;
		},

		getCurrVertexOffset: function(){
			return this._numVerticesWritten;
		},

		_handleBeginSave: function(){

		},

		newObject: function( name ){
			this.__bufferString += "o " + name + "\n";
		},

		normal: function( vecN ){
			this.__bufferString +="vn " + vecN.x + " " + vecN.y + " " + vecN.z + "\n";
			this._numNormalsWritten++;
		},

		vertex: function( vecV ){
			this.__bufferString += "v " + vecV.x + " " + vecV.y + " " + vecV.z +"\n";
			this._numVerticesWritten++;
		}
	}


	return OBJWriter;

});