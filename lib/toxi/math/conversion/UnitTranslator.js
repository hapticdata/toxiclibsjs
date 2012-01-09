define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class
 * @member toxi
 */
var	UnitTranslator = {
	//Number of millimeters per inch
	INCH_MM: 25.4,
	//number of points per inch
	POINT_POSTSCRIPT: 72.0,
	/**
	* Converts millimeters into pixels.
	* @param {Number} mm millimeters
	* @param {Number} dpi DPI resolution
	* @return {Number} number of pixels
	*/
	millisToPixels: function(mm,dpi){
		return Math.floor(mm / this.INCH_MM * dpi);
	},
	/**
	* Converts millimeters into postscript points
	* @param {Number} mm millimeters
	* @return {Number} number of points
	*/
	millisToPoints: function(mm){
		return mm / this.INCH_MM * this.POINT_POSTSCRIPT;
	},
	/**
	* Converts pixels into inches
	* @param {Nuumber} pix pixels
	* @param {Number} dpi DPI resolution to use
	* @return {Number} number of inches
	*/
	pixelsToInch: function(pix,dpi){
		return pix / dpi;
	},
	/**
	* Converts pixels into millimeters.
	* @param {Number} pix pixels
	* @param {Number} dpi DPI resolution
	* @return {Number} number of millimeters
	*/
	pixelsToMillis: function(pix,dpi){
		return this.pixelsToInch(pix,dpi) * this.INCH_MM;
	},
	/**
	* Converts pixels into points.
	* @param {Number} pix pixels
	* @param {Number} dpi DPI resolution
	* @return {Number} number of points
	*/
	pixelsToPoints: function(pix,dpi){
		return this.pixelsToInch(pix,dpi) * this.POINT_POSTSCRIPT;
	},
	/**
	* Converts points into millimeters.
	* @param {Number} pt
	* @return {Number} number of millimeters
	*/
	pointsToMillis: function(pt){
		return pt / this.POINT_POSTSCRIPT * this.INCH_MM;
	},
	/**
	* Converts points into pixels.
	* 
	* @param {Number} pt points
	* @param {Number} dpi DPI resolution
	* @return {Number} number of pixels
	*/
	pointsToPixels: function(pt, dpi){
		return this.millisToPixels(this.pointsToMillis(pt), dpi);
	},
	/**
	* Converts an area measure in square inch to square millimeters.
	* @param {Number} area
	* @return {Number} square mm
	*/
	squareInchToMillis: function(area){
		return area * this.INCH_MM * this.INCH_MM;
	},
	/**
	* Converts an area measure in points to square inch.
	* @param {Number} area
	* @return {Number} square inch
	*/
	squarePointsToInch: function(area){
		return area / (this.POINT_POSTSCRIPT * this.POINTPOSCRIPT);
	},
	/**
	* Converts an area measure in points to square millimeters.
	* @param {Number} area
	* @return {Number} square mm
	*/
	squarePointsToMillis: function(area){
		return this.squareInchToMillis(this.squarePointsToInch(area));
	}	
};

module.exports = UnitTranslator;
});
