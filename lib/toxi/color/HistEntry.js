define(function( require ){
	var HistEntry = function( c ){
		this.col = c;
		this.freq = 1;
	};

	HistEntry.prototype = {
		constructor: HistEntry,
		compareTo: function( entry ){
			return parseInt( entry.freq - this.freq, 10 );
		},
		getColor: function(){
			return this.col;
		},
		getFrequency: function(){
			return this.freq;
		}
	};
	return HistEntry;
});