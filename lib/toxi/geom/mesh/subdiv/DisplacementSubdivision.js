define([
	'../../../internals',
	'./SubdivisionStrategy'
], function ( internals, SubdivisionStrategy ){
	//Abstract class
	var DisplacementSubdivision, proto;
	DisplacementSubdivision = function( amp ){
		SubdivisionStrategy.call(this);
		this.amp = amp;
	};
	internals.extend( DisplacementSubdivision, SubdivisionStrategy );
	proto = DisplacementSubdivision.prototype;

	proto.getAmp = function(){ return this.amp; };
	proto.invertAmp = function(){
		this.amp *= -1;
		return this;
	};
	proto.scaleAmp = function( scale ){
		this.amp *= scale;
		return this;
	};
	proto.setAmp = function( amp ){
		this.amp = amp;
		return this;
	};

	return DisplacementSubdivision;
});
    