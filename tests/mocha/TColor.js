/*global describe, it*/
var toxi = require('../../index'),
	assert = require('assert');


describe('TColor', function(){
	describe('fromCSS', function(){
		describe('width X11 css name', function(){
			//case-insensitive
			var color = toxi.color.TColor.newCSS( 'MedIuMAqUamarine' );
			it('should return X11 Aquamarine', function(){
				assert.equal(color.red(),102/255);
				assert.equal(color.green(), 205/255);
				assert.equal(color.blue(), 170/255);
			});
		});
		describe('with #00ff00 format', function(){
			var color = toxi.color.TColor.newCSS( '#00ffff');
			it('should return rgb 0,1,1', function(){
				assert.equal(color.red(), 0);
				assert.equal(color.green(), 1);
				assert.equal(color.blue(), 1);
			});
		});

		//using awkward spaces to test stripping it out
		describe('with rgba() string', function(){
			var color = toxi.color.TColor.newCSS( 'rgba ( 128, 128, 128,   0.5)' );
			it('should return 50% gray', function(){
				assert.equal(color.red(), 128/255);
				assert.equal(color.green(), 128/255);
				assert.equal(color.blue(), 128/255);
				assert.equal(color.alpha(), 0.5);
			});
		});
		
		describe('with rgb() string', function(){
			var color = toxi.color.TColor.newCSS( 'rgb(128,   128, 128)' );
			it('should return 50% gray', function(){
				assert.equal(color.red(), 128/255);
				assert.equal(color.green(), 128/255);
				assert.equal(color.blue(), 128/255);
				assert.equal(color.alpha(), 1.0);
			});
		});

		describe('with hsla() string', function(){
			it('should return an hsla color', function(){
				var clr = toxi.color.TColor.newCSS( 'hsla( 270, 50%, 75%, 0.5 )' );
				assert.equal(clr.hue(), 0.75 );
				assert.equal(clr.saturation(), 0.5 );
				assert.equal(clr.brightness(), 0.75 );
				assert.equal(clr.alpha(), 0.5);
			});
		});


	});
});