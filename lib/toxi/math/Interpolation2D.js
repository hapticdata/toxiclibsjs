define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class Implementations of 2D interpolation functions (currently only bilinear).
 * @member toxi
 * @static
 */
var Interpolation2D = {};
/**
 * @param {Number} x
 *            x coord of point to filter (or Vec2D p)
 * @param {Number} y
 *            y coord of point to filter (or Vec2D p1)
 * @param {Number} x1
 *            x coord of top-left corner (or Vec2D p2)
 * @param {Number} y1
 *            y coord of top-left corner
 * @param {Number} x2
 *            x coord of bottom-right corner
 * @param {Number} y2
 *            y coord of bottom-right corner
 * @param {Number} tl
 *            top-left value
 * @param {Number} tr
 *            top-right value (do not use if first 3 are Vec2D)
 * @param {Number} bl
 *            bottom-left value (do not use if first 3 are Vec2D)
 * @param {Number} br
 *            bottom-right value (do not use if first 3 are Vec2D)
 * @return {Number} interpolated value
 */
Interpolation2D.bilinear = function(_x, _y, _x1,_y1, _x2, _y2, _tl, _tr, _bl, _br) {
	var x,y,x1,y1,x2,y2,tl,tr,bl,br;
	if( internals.tests.hasXY( _x ) ) //if the first 3 params are passed in as Vec2Ds
	{
		x = _x.x;
		y = _x.y;
		
		x1 = _y.x;
		y1 = _y.y;
		
		x2 = _x1.x;
		y2 = _x1.y;
		
		tl = _y1;
		tr = _x2;
		bl = _y2;
		br = _tl;
	} else {
		x = _x;
		y = _y;
		x1 = _x1;
		y1 = _y1;
		x2 = _x2;
		y2 = _y2;
		tl = _tl;
		tr = _tr;
		bl = _bl;
		br = _br;
	}
    var denom = 1.0 / ((x2 - x1) * (y2 - y1));
    var dx1 = (x - x1) * denom;
    var dx2 = (x2 - x) * denom;
    var dy1 = y - y1;
    var dy2 = y2 - y;
    return (tl * dx2 * dy2 + tr * dx1 * dy2 + bl * dx2 * dy1 + br* dx1 * dy1);
};

module.exports = Interpolation2D;
});
