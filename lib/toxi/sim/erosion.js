define([
	'require',
	'exports',
	'./erosion/ErosionFunction',
	'./erosion/TalusAngleErosion',
	'./erosion/ThermalErosion'
], function( require, exports ){
	exports.ErosionFunction = require('./erosion/ErosionFunction');
	exports.TalusAngleErosion = require('./erosion/TalusAngleErosion');
	exports.ThermalErosion = require('./erosion/ThermalErosion');
});