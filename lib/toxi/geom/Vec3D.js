define(['require','exports','module','./vectors'], function( require, exports, module ){
	//Vec3D is defined in toxi/geom/vectors to circumvent circular dependencies
	module.exports = require('./vectors').Vec3D;
});