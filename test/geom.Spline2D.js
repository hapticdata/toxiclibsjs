/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');
//tests for toxi.geom.Spline2D
//TODO: test Spline2D#getDecimatedVertices()
describe("Spline2D", function(){
	describe('default instance', function(){
		var instance = new toxi.geom.Spline2D();
		it('should have default tightness', function(){
			assert.equal(instance.getTightness(), toxi.geom.Spline2D.DEFAULT_TIGHTNESS);
		});

		describe('#add()', function(){
			it('should add vertices', function(){
				var length = 10;
				getNVec2D( length ).forEach(function( v ){
					instance.add( toxi.geom.Vec2D.randomVector() );
				});
				assert.equal( instance.getNumPoints(), length );
				assert.equal( instance.pointList.length, length );
			});
		});

		testInstance( instance );
	});
	describe('instance with points in constructor', function(){
		var instance = new toxi.geom.Spline2D( getNVec2D( 10 ) );
		testInstance( instance );
	});
	describe('instance with points and custom bernstein polynomial', function(){
		var instance = new toxi.geom.Spline2D( getNVec2D(10), new toxi.geom.BernsteinPolynomial( 12 ) );
		assert.equal(instance.bernstein.resolution, 12 );
		testInstance( instance );
	});
	describe('instance with points and custom bernstein polynomial and tightntess', function(){
		var instance = new toxi.geom.Spline2D( getNVec2D(10), new toxi.geom.BernsteinPolynomial( 14 ), 0.5 );
		it('should have the bernstein.resolution set', function(){
			assert.equal(instance.bernstein.resolution, 14 );
		});
		it('should have the tightness set', function(){
			assert.equal(instance.getTightness(), 0.5 );
		});
		testInstance( instance );
	});

	describe('instance with an options object', function(){
		var instance = new toxi.geom.Spline2D({
			points: getNVec2D( 25 ),
			tightness: 0.75
		});
		it('should have 25 points', function(){
			assert.equal(instance.getNumPoints(), 25);
		});
		it('should have a tightness of 0.75', function(){
			assert.equal(instance.getTightness(), 0.75);
		});
		testInstance( instance );
	});

	function getNVec2D( n ){
		var points = [];
		for(var i=0; i<n; i++){
			points.push( toxi.geom.Vec2D.randomVector() );
		}
		return points;
	}

	//run these tests on each instance
	function testInstance( instance ){
		it('should be a valid instance', function(){
			assert.equal(instance instanceof toxi.geom.Spline2D, true);
			assert.equal(typeof instance.setTightness, 'function');
			assert.equal(typeof instance.getEstimatedArcLength, 'function');
			assert.equal(instance.computeVertices, toxi.geom.Spline2D.prototype.computeVertices);
		});
		describe('compute vertices', function(){
			//test these resolutions
			[2,3,4,5,6,7,8,9,10,20].forEach(function( res ){
				it('for resolution ' + res, function(){
					var vertices = instance.computeVertices( res );
					assert.equal( vertices.length, instance.getNumPoints() * res - res );
					//ensure that all vertex positions are valid numbers
					vertices.forEach(function( vert ){
						['x','y'].forEach(function( a ){
							assert.equal(typeof vert[a], 'number');
							assert.equal(isNaN( vert[a] ), false );
						});
					});
				});
			});
		});

		describe('getEstimatedArcLength', function(){
			//instance.computeVertices( 4 );
			it('should return a valid number', function(){
				assert.equal(typeof instance.getEstimatedArcLength(), 'number');
			});
		});
	}
});