/*global describe, it*/
var toxi = require('../../../index'),
	assert = require('assert');


function testErosion( instance ){
	describe("#setElevation()", function(){
		var i=0, w = 20, h = 10;
		var elevation = [];
		for(i=0; i<w*h; i++){
			elevation[i] = 0.1;
		}
		instance.setElevation(elevation,  w, h );
		it('should have accepted elevation array, width and height', function(){
			assert.equal(instance.elevation, elevation);
			assert.equal(instance.width, w);
			assert.equal(instance.height,h);
		});
	});

	describe("#erodeAll()", function(){
		for(var i=0; i<10; i++){
			instance.erodeAll();
		}
		it('should still have a valid elevation', function(){
			for(var i=0, l = instance.elevation.length; i<l; i++){
				console.log(instance.elevation[i]);
				assert.equal(isNaN(instance.elevation[i]), false);
			}
		});
	});
}

describe('sim.erosion', function(){
	describe('ThermalErosion', function(){
		var instance = new toxi.sim.erosion.ThermalErosion();
		it('should extend ErosionFunction', function(){
			assert.equal(instance instanceof toxi.sim.erosion.ErosionFunction, true);
			assert.equal(instance instanceof toxi.sim.erosion.ThermalErosion, true);
		});
		testErosion( instance );
	});
	describe('TalusAngleErosion', function(){
		var angle = 0.01;
		var amount = -0.1;
		var instance = new toxi.sim.erosion.TalusAngleErosion( angle, amount );
		it('should extend ErosionFunction', function(){
			assert.equal(instance instanceof toxi.sim.erosion.ErosionFunction, true);
		});
		it('angle should equal '+angle, function(){
			assert.equal(instance.getTheta(), angle);
		});
		it('amount should equal '+amount, function(){
			assert.equal(instance.getAmount(), amount);
		});

		testErosion( instance );


	});
});