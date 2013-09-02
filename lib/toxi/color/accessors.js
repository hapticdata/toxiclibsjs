define(function( require, exports, module ){

	var numberComparator = require('../internals').numberComparator,
		bind = require('../internals').bind;

	//this will attach proper exported objects for each accessor
	function make( type, setters ){
		var name = type + 'Accessor', arry = type.toLowerCase(); //make HSV hsv etc
		exports[name] = function( comp ){
			this.component = comp;
			//compare() could easily be used in incorrect scope, bind it
			this.compare = bind( this.compare, this );
		};

		exports[name].prototype.compare = function( a, b ){
			var ca = a[arry][this.component],
				cb = b[arry][this.component];
			return numberComparator( ca, cb );
		};

		exports[name].prototype.getComponentValueFor = function( col ){
			return col[arry][this.component];
		};

		exports[name].prototype.setComponentValueFor = function( col, val ){
			col[ 'set'+setters[this.component] ]( val );
		};

	}

	make('RGB',['Red','Green','Blue']);
	make('HSV',['Hue','Saturation','Brightness']);
	make('CMYK',['Cyan','Magenta','Yellow','Black']);

	var LuminanceAccessor = function(){};
	LuminanceAccessor.prototype.compare = function( a, b ){
		return numberComparator( a.luminance(), b.luminance() );
	};
	LuminanceAccessor.prototype.getComponentValueFor = function( col ){
		return col.luminance();
	};
	LuminanceAccessor.prototype.setComponentValueFor = function(){};

	var AlphaAccessor = function(){};
	AlphaAccessor.prototype.compare = function(a,b){
		return numberComparator( a.alpha(), b.alpha() );
	};
	AlphaAccessor.prototype.getComponentValueFor = function(col){
		return col.alpha();
	};
	AlphaAccessor.prototype.setComponentValueFor = function(col, value){
		col.setAlpha(value);
	};

	exports.LuminanceAccessor = LuminanceAccessor;
	exports.AlphaAccessor = AlphaAccessor;

});
