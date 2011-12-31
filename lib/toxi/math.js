module.exports = {
	BezierInterpolation: require('./math/BezierInterpolation'),
	CircularInterpolation: require('./math/CircularInterpolation'),
	CosineInterpolation: require('./math/CosineInterpolation'),
	DecimatedInterpolation: require('./math/DecimatedInterpolation'),
	ExponentialInterpolation: require('./math/ExponentialInterpolation'),
	Interpolation2D: require('./math/Interpolation2D'),
	LinearInterpolation: require('./math/LinearInterpolation'),
	mathUtils: require('./math/mathUtils'),
	//providing upper-cased version to be more obvious for people coming from java
	MathUtils: require('./math/mathUtils'),
	ScaleMap: require('./math/ScaleMap'),
	SigmoidInterpolation: require('./math/SigmoidInterpolation'),
	SinCosLUT: require('./math/SinCosLUT'),
	ThresholdInterpolation: require('./math/ThresholdInterpolation'),
	ZoomLensInterpolation: require('./math/ZoomLensInterpolation')
};

module.exports.noise = require('./math/noise');
module.exports.waves = require('./math/waves');