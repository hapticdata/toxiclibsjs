/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');


describe('TColor', function(){
	describe('static factories', function(){
		describe('newRGBA', function(){
			var c = toxi.color.TColor.newRGBA(0.75,0.5,0.25,1.0);
			it('should have correct rgba values', function(){
				assert.equal( c.red(), 0.75 );
				assert.equal( c.green(), 0.5 );
				assert.equal( c.blue(), 0.25 );
				assert.equal( c.alpha(), 1.0 );
			});
		});
		describe('newHSV', function(){
			var c = toxi.color.TColor.newHSV( 0.25, 0.5, 0.75 );
			it('should have correct hsva values', function(){
				assert.equal( c.hue(), 0.25 );
				assert.equal( c.saturation(), 0.5 );
				assert.equal( c.brightness(), 0.75 );
				assert.equal( c.alpha(), 1.0 );
			});
		});
		describe('newCSS', function(){
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
	
	describe("prototype functions", function(){
		var c = toxi.color.TColor.newRGBA(0.75,0.5,0.25,1.0);
		describe('#toARGB()', function(){
			it('should return proper packed integer', function(){
				assert.equal( c.toARGB(), -4227265 );
			});
		});

		describe('#toCMYKArray([])', function(){
			var cmyka = c.toCMYKAArray([]);
			it('should be c0, m0.25, y0.5, k0.25, a1.0]', function(){
				assert.equal(cmyka[0],0 );
				assert.equal(cmyka[1],0.25);
				assert.equal(cmyka[2],0.5 );
				assert.equal(cmyka[3],0.25 );
				assert.equal(cmyka[4],1.0 );
			});
		});

		describe('#toHex([])', function(){
			var hex = c.toHex();
			it("should be 'bf7f3f'", function(){
				assert.equal( hex, "bf7f3f" );
			});
		});

		describe("#toHSVAArray([])", function(){
			var hsva = c.toHSVAArray([]);
			//values confirmed in java
			it('should equal [ 0.083333336, 0.6666667, 0.75, 1.0 ]', function(){
				assert.ok(hsva[0] >0.083 && hsva[0] < 0.84);
				assert.ok(hsva[1] > 0.6 && hsva[1] < 0.67);
				assert.equal( hsva[2], 0.75 );
				assert.equal(hsva[3],1.0);
			});
		});

		describe("#toRGBAArray([])", function(){
			var rgba = c.toRGBAArray([]);
			it('should equal [ 0.75, 0.5, 0.25, 1.0 ]', function(){
				assert.equal( rgba[0],0.75 );
				assert.equal( rgba[1],0.5 );
				assert.equal( rgba[2],0.25 );
				assert.equal( rgba[3],1.0 );
			});
		});

		describe("build typed array with offset", function(){

			function testHSVA( arr ){
				assert.ok(arr[0] >0.083 && arr[0] < 0.84);
				assert.ok(arr[1] > 0.6 && arr[1] < 0.67);
				assert.equal( arr[2], 0.75 );
				assert.equal(arr[3], 1.0);
			}
			var arr = new Float32Array( 8 );
			describe("#toHSVAArray( float32Array ) then #toRGBAArray( float32Array, 4 )", function(){
				it('should equal [ 0.083333336, 0.6666667, 0.75, 1.0 ]', function(){
					c.toHSVAArray( arr );
					testHSVA( arr );
				});
				it('should retain same values', function(){
					c.toRGBAArray( arr, 4 );
					testHSVA( arr );
					assert.equal(arr[4],0.75 );
					assert.equal(arr[5],0.5 );
					assert.equal(arr[6],0.25 );
					assert.equal(arr[7],1.0 );
				});
			});
		});
	});
});
