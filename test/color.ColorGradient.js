/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

describe('ColorGradient', function(){
	var cg = new toxi.color.ColorGradient();

	var red = toxi.color.TColor.newRGBA( 1.0, 0, 0, 1.0 ),
		green = toxi.color.TColor.newRGBA(0, 1.0, 0, 1.0 ),
		blue = toxi.color.TColor.newRGBA( 0, 0, 1.0, 1.0 );

	it('should be a ColorGradient', function(){
		assert.ok( cg instanceof toxi.color.ColorGradient );
		assert.ok( Array.isArray( cg._gradient ) );
		assert.equal( typeof cg.calcGradient, 'function' );
	});

	describe('#addColorAt', function(){
		it('should add red to _gradient', function(){
			cg.addColorAt( 0, red );
			assert.equal( cg.getGradientPoints().length, 1 );
		});

		it('should add green to _gradient at 0.5', function(){
			cg.addColorAt( 1, green );
			var gp = cg.getGradientPoints();
			assert.equal( gp.length, 2);
			assert.ok( green.equals(gp[gp.length-1].color) );
		});

		it('should add blue to _gradient at 1.0', function(){
			cg.addColorAt( 10, blue );
			var gp = cg.getGradientPoints();
			assert.equal( gp.length, 3 );
		});
	});

	describe('#calcGradient', function(){
		it('should return a ColorList', function(){
			console.log( cg.getGradientPoints().length );
			var colorList = cg.calcGradient( );
			assert.ok( colorList instanceof toxi.color.ColorList );
			console.log( colorList );
			assert.ok( colorList.contains( red ) );
			assert.ok( colorList.contains( green ) );
			assert.ok( colorList.contains( blue ) );
			//assert.equal( colorList.size(), 10 );
		});
	});
	


});
