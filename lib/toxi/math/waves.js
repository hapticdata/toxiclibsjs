define(["require", "exports", "module", "./waves/AbstractWave","./waves/AMFMSineWave","./waves/ConstantWave","./waves/FMHarmonicSquareWave","./waves/FMSawtoothWave","./waves/FMSineWave","./waves/FMSquareWave","./waves/FMTriangleWave","./waves/SineWave","./waves/WaveState"], function(require, exports, module) {
/** @module toxi/math/waves */
module.exports = {
	AbstractWave: require('./waves/AbstractWave'),
	AMFMSineWave: require('./waves/AMFMSineWave'),
	ConstantWave: require('./waves/ConstantWave'),
	FMHarmonicSquareWave: require('./waves/FMHarmonicSquareWave'),
	FMSawtoothWave: require('./waves/FMSawtoothWave'),
	FMSineWave: require('./waves/FMSineWave'),
	FMSquareWave: require('./waves/FMSquareWave'),
	FMTriangleWave: require('./waves/FMTriangleWave'),
	SineWave: require('./waves/SineWave'),
	WaveState: require('./waves/WaveState')
};
});
