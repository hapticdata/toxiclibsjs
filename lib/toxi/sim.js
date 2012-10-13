define([
	'require',
	'exports',
	'./sim/automata',
	'./sim/erosion'
], function( require, exports ){
	exports.automata = require('./sim/automata');
	exports.erosion = require('./sim/erosion');
});