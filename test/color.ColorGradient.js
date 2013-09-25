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
		assert.ok( Array.isArray( cg.gradient ) );
		assert.equal( typeof cg.calcGradient, 'function' );
	});

	describe('#addColorAt()', function(){
		it('should add red to _gradient', function(){
			cg.addColorAt( 1, red );
			assert.equal( cg.getGradientPoints().length, 1 );
		});

		it('should add green to _gradient at 0.5', function(){
			cg.addColorAt( 2, green );
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

	describe('#calcGradient()', function(){
		it('w/ no params, should return a ColorList', function(){
			var colorList = cg.calcGradient( );
			assert.ok( colorList instanceof toxi.color.ColorList );
			assert.ok( colorList.contains( red ) );
			assert.ok( colorList.contains( green ) );
			//assert.ok( colorList.contains( blue ) );
			assert.equal( colorList.size(), 9 );
		});

        //This part is confusing to me, it matches java version,
        //but not what I would've expected for behavior
        it('w/ pos, width, should return a ColorList', function(){
            var colorList = cg.calcGradient( 3, 10 );
            assert.equal( colorList.contains( red ), false );
            assert.equal( colorList.size(), 10 );
        });
	});



});
