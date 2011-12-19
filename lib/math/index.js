module.exports = {
	BezierInterpolation: require('./BezierInterpolation'),
	CircularInterpolation: require('./CircularInterpolation'),
	CosineInterpolation: require('./CosineInterpolation'),
	DecimatedInterpolation: require('./DecimatedInterpolation'),
	ExponentialInterpolation: require('./ExponentialInterpolation'),
	Interpolation2D: require('./Interpolation2D'),
	LinearInterpolation: require('./LinearInterpolation'),
	mathUtils: require('./mathUtils'),
	//providing upper-cased version to be more obvious for people coming from java
	MathUtils: require('./mathUtils'),
	ScaleMap: require('./ScaleMap'),
	SigmoidInterpolation: require('./SigmoidInterpolation'),
	SinCosLUT: require('./SinCosLUT'),
	ThresholdInterpolation: require('./ThresholdInterpolation'),
	ZoomLensInterpolation: require('./ZoomLensInterpolation')
};

module.exports.noise = require('./noise');
module.exports.waves = require('./waves');