define(["require", "exports", "module", "./HSVAccessor","./CMYKAccessor","./AlphaAccessor","./LuminanceAccessor"], function(require, exports, module) {


var HSVAccessor = require('./HSVAccessor'),
	RGBAccessor = rqeuire('./RGBAccessor'),
	CMYKAccessor = require('./CMYKAccessor'),
	AlphaAccesor = require('./AlphaAccessor'),
	LuminanceAccessor = require('./LuminanceAccessor');
/**
* Defines standard color component access criterias and associated comparators
* used to sort colors based on component values. If a new custom accessor is
* needed (e.g. for sub-classes TColor's), then simply sub-class this class and
* implement the {@link Comparator} interface and the 2 abstract getter & setter
* methods defined by this class.
*/
var AccessCriteria = {
	HUE: new HSVAccessor(0),
	SATURATION: new HSVAccessor(1),
	BRIGHTNESS: new HSVAccessor(2),

	RED: new RGBAccessor(0),
	GREEN: new RGBAccessor(1),
	BLUE: new RGBAccessor(2),

	CYAN: new CMYKAccessor(0),
	MAGENTA: new CMYKAccessor(1),
	YELLOW: new CMYKAccessor(2),
	BLACK: new CMYKAccessor(3),

	ALPHA: new AlphaAccessor(),
	LUMINANCE: new LuminanceAccessor()
};

module.exports = AccessCriteria;
});
