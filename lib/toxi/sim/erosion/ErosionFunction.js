define([
	'toxi/geom/Polygon2D',
	'toxi/geom/Rect',
	'toxi/geom/Vec2D'
], function( Polygon2D, Rect, Vec2D ){

	var ErosionFunction = function(){
		this.elevation = [];
		this.width = 0;
		this.height = 0;
		this._d = [0,0,0,0,0,0,0,0,0];
		this._h = [0,0,0,0,0,0,0,0,0];
		this._off = [];
	};
	ErosionFunction.prototype = {
		erodeAll: function(){
			var y, x, w1 = this.width -1, h1 = this.height -1;
			for(y=1; y<h1; y++){
				for(x=1; x<w1; x++){
					this.erodeAt(x,y);
				}
			}
		},
		erodeAt: function(){
			throw Error('ErosionFunction is an abstract, do not call directly');
		},
		erodeWithinPolygon: function( poly ){
			var bounds, pos, y, y2, x, x2;
			pos = new Vec2D();
			bounds = poly.getBounds().intersectionRectWith(
				new Rect(1,1, this.width-2, this.height-2)
			);
			y2 = parseInt(bounds.getBottom(), 10);
			for(y=parseInt(bounds.getTop(), 10); y<y2; y++){
				x2 = parseInt(bounds.getRight(),10);
				for(x=parseInt(bounds.getLeft(),10); x<x2; x++){
					if( poly.containsPoint(pos.set(x,y)) ){
						this.erodeAt( x,y );
					}
				}
			}
		},
		// {Number[]} elevation,
		// {Number} width
		// {Number} height
		setElevation: function( elevation, width, height ){
			this.elevation = elevation;
			this.width = width;
			this.height = height;
			this._off = [ -width-1, -width, -width+1, -1, 0, 1, width-1, width, width+1 ];
		}
	};

	return ErosionFunction;
});