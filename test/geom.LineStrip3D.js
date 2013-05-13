var toxi = require('../index'),
	assert = require('assert');


describe('LineStrip3D', function(){
	var strip = new toxi.geom.LineStrip3D();
	it('should be a valid instance', function(){
		assert.ok( strip instanceof toxi.geom.LineStrip3D );
		assert.equal( typeof strip.getDecimatedVertices, 'function');
	});

	describe('#add()', function(){
		var points = [
			{ x: 0, y: 0, z: 0 },
			{ x: 10, y: 1, z: 1 },
			{ x: 5, y: 10, z: -5 },
			{ x: -3, y: 5, z: 5 }
		];
		points.forEach(function( pt ){
			strip.add( pt );
		});

		it('should have 4 points', function(){
			assert.equal( strip.vertices.length, 4 );
			strip.vertices.forEach(function( v, i ){
				assert.ok( v.equals( points[i] ) );
			});
		});
	});

	describe('#getDecimatedVertices()', function(){
		var step = 2.5;
		it('should have all equidistant points', function(){
			var pts = strip.getDecimatedVertices( step );
			console.log( pts );
			for( var i=0; i<pts.length-1; i++){
				var p = pts[i];
				var q = pts[i+1];
				var actualStep = p.distanceTo( q );
				console.log( actualStep +' === ' + step );
				assert.ok( Math.abs(actualStep - step) < 0.1 );
			}
		});
	});

});
