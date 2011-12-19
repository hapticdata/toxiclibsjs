/**
	T O X I C L I B S . JS 
	http://haptic-data.com/toxiclibsjs
	a port of toxiclibs for Java / Processing written by Karsten Schmidt
		
	License			: GNU Lesser General Public version 2.1
	Developer		: Kyle Phillips: http://haptic-data.com
	Java Version		: http://toxiclibs.org
*/

/** 
 * @namespace
 * @module toxi
 */
module.exports.version = "r42";
module.exports = {
	color: require('./color'),
	geom: require('./geom'),
	math: require('./math'),
	libUtils: require('./libUtils'),
	utils: require('./utils')
};

