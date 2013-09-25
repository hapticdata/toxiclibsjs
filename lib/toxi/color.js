define(function(require, exports) {
	exports.accessCriteria = require('./color/accessCriteria');
    //keep it uppercase also
    exports.AccessCriteria = exports.accessCriteria;
	exports.AlphaAccessor = require('./color/AlphaAccessor');
	exports.CMYKAccessor = require('./color/CMYKAccessor');
	exports.CMYKDDistanceProxy = require('./color/CMYKDistanceProxy');
	exports.ColorGradient = require('./color/ColorGradient');
	exports.ColorList = require('./color/ColorList');
    exports.ColorRange = require('./color/ColorRange');
    exports.ColorTheme = require('./color/ColorTheme');
    exports.createListUsingStrategy = require('./color/createListUsingStrategy');
    exports.HistEntry = require('./color/HistEntry');
    exports.Histogram = require('./color/Histogram');
	exports.HSVAccessor = require('./color/HSVAccessor');
	exports.HSVDistanceProxy = require('./color/HSVDistanceProxy');
    exports.Hue = require('./color/Hue');
	exports.LuminanceAccessor = require('./color/LuminanceAccessor');
    exports.namedColor = require('./color/namedColor');
    exports.NamedColor = exports.namedColor;
	exports.ProximityComparator = require('./color/ProximityComparator');
	exports.RGBAccessor = require('./color/RGBAccessor');
	exports.RGBDistanceProxy = require('./color/RGBDistanceProxy');
	exports.TColor = require('./color/TColor');
    exports.theory = require('./color/theory');
    exports.ToneMap = require('./color/ToneMap');
});
