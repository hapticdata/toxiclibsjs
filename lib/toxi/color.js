define(function(require, exports) {
	exports.AccessCriteria = require('./color/AccessCriteria');
	exports.AlphaAccessor = require('./color/AlphaAccessor');
	exports.CMYKAccessor = require('./color/CMYKAccessor');
	exports.CMYKDDistanceProxy = require('./color/CMYKDistanceProxy');
	exports.ColorGradient = require('./color/ColorGradient');
	exports.ColorList = require('./color/ColorList');
    exports.HistEntry = require('./color/HistEntry');
    exports.Histogram = require('./color/Histogram');
	exports.HSVAccessor = require('./color/HSVAccessor');
	exports.HSVDistanceProxy = require('./color/HSVDistanceProxy');
    exports.Hue = require('./color/Hue');
	exports.LuminanceAccessor = require('./color/LuminanceAccessor');
	exports.ProximityComparator = require('./color/ProximityComparator');
	exports.RGBAccessor = require('./color/RGBAccessor');
	exports.RGBDistanceProxy = require('./color/RGBDistanceProxy');
	exports.TColor = require('./color/TColor');
});
