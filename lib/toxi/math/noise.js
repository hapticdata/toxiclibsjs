define(["require", "exports", "module", "./noise/PerlinNoise","./noise/simplexNoise"], function(require, exports, module) {
/** module toxi/math/noise 
	@api public
*/
module.exports = {
	PerlinNoise: require('./noise/PerlinNoise'),
	simplexNoise: require('./noise/simplexNoise')	
};
});
