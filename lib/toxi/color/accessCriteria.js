define(function( require, exports ) {


var HSVAccessor = require('./HSVAccessor'),
	RGBAccessor = require('./RGBAccessor'),
	CMYKAccessor = require('./CMYKAccessor'),
	AlphaAccessor = require('./AlphaAccessor'),
	LuminanceAccessor = require('./LuminanceAccessor');
/**
* Defines standard color component access criterias and associated comparators
* used to sort colors based on component values. If a new custom accessor is
* needed (e.g. for sub-classes TColor's), then simply sub-class this class and
* implement the {@link Comparator} interface and the 2 abstract getter & setter
* methods defined by this class.
*/
exports.HUE = new HSVAccessor(0),
exports.SATURATION = new HSVAccessor(1),
exports.BRIGHTNESS = new HSVAccessor(2),

exports.RED = new RGBAccessor(0),
exports.GREEN = new RGBAccessor(1),
exports.BLUE = new RGBAccessor(2),

exports.CYAN = new CMYKAccessor(0),
exports.MAGENTA = new CMYKAccessor(1),
exports.YELLOW = new CMYKAccessor(2),
exports.BLACK = new CMYKAccessor(3),

exports.ALPHA = new AlphaAccessor(),
exports.LUMINANCE = new LuminanceAccessor();

});
