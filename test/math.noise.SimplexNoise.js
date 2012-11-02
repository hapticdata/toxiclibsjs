/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

var simplexNoise = toxi.math.noise.simplexNoise;
//toxi.math.noise.SimplexNoise
describe("SimplexNoise.noise", function(){
	describe('2d', function(){
		it("should be 2d noise", function(){
			var n = simplexNoise.noise( 0.5, 0.5 );
			assert.equal( typeof n, 'number' );
		});
	});
	describe('3d', function(){
		it("should be 3d noise", function(){
			var n = simplexNoise.noise( 0.5, 0.5, 0.5 );
			assert.equal( typeof n, 'number' );
		});
	});
	describe('4d', function(){
		var n = simplexNoise.noise( 0.5, 0.5, 0.5, 0.5 );
		it('should be a number', function(){
			assert.equal( typeof n, 'number' );
		});
	});
});