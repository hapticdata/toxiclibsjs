define(function( require ){

	var each = require('../internals').each,
		Iterator = require('../internals').Iterator,
		HistEntry = require('./HistEntry'),
		ColorList = require('./ColorList');

	/**
	 * Histogram constructor
	 * @param {toxi.color.ColorList} palette
	 */
	var Histogram = function( palette ){
		this.palette = palette;
	};

	Histogram.prototype = {
		constructor: Histogram,
		/**
		 * @param {Number} tolerance color tolerance used to merge similar colors
		 * (based on RGB distance)
		 * @param {Boolean} blendCols switch to enable color blending of binned colors
		 * @type sorted histogram as List of HistEntry
		 */
		compute: function( tolerance, blendCols ){
			var self = this;
			this.entries = [];
			var maxFreq = 1;
			this.palette.each(function( c ){
				var existing, e, i=0, l=self.entries.length;
				for( i=0; i<l; i++ ){
					e = self.entries[i];
					if( e.col.distanceToRGB(c) < tolerance ){
						if( blendCols ){
							e.col.blend( c, 1/(e.freq+1) );
						}
						existing = e;
						break;
					}
				}
				if( existing !== undefined ){
					existing.freq++;
					if( existing.freq > maxFreq ){
						maxFreq = existing.freq;
					}
				} else {
					self.entries.push( new HistEntry(c) );
				}
			});
			this.entries.sort();
			maxFreq = 1/this.palette.size();

			each( this.entries, function( e ){
				e.freq *= maxFreq;
			});

			return this.entries;
		},
		getEntries: function(){
			return this.entries;
		},
		getPalette: function(){
			return this.palette;
		},
		iterator: function(){
			return new Iterator( this.entries );
		},
		setPalette: function( palette ){
			this.palette = palette;
		}
	};

	Histogram.newFromARGBArray = function( pixels, numSamples, tolerance, blendCols ){
		var h = new Histogram( ColorList.createFromARGBArray(pixels, numSamples, false) );
		h.compute( tolerance, blendCols );
		return h;
	};

	return Histogram;
});