define([
	"require",
	"exports",
	"./color",
	"./geom",
	"./internals",
	"./math",
	"./physics2d",
	"./processing",
	"./THREE",
	"./util"
	], function(require, exports) {
		exports.color = require('./color');
		exports.geom = require('./geom');
		exports.internals = require('./internals');
		exports.math = require('./math');
		exports.physics2d = require('./physics2d');
		exports.processing = require('./processing');
		exports.THREE = require('./THREE');
		exports.util = require('./util');
});
