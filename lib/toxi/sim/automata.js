define([
	'require',
	'exports',
	'./automata/CAMatrix',
	'./automata/CARule2D',
	'./automata/CAWolfram1D'
], function( require, exports ){
	exports.CAMatrix = require('./automata/CAMatrix');
	exports.CARule2D = require('./automata/CARule2D');
	exports.CAWolfram1D = require('./automata/CAWolfram1D');
});