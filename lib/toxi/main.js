define([
	"./color",
	"./geom",
	"./internals",
	"./math",
	"./physics2d",
	"./processing",
	"./THREE",
	"./utils"
	], function(color,geom,internals,math,physics2d,processing,THREE,utils) {

	return {
		color: color,
		geom: geom,
		internals: internals,
		math: math,
		physics2d: physics2d,
		processing: processing,
		THREE: THREE,
		utils: utils
	};

});
