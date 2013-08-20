var toxi = require('../index'),
	assert = require('assert');

var withTolerance = function( a , b, tolerance ){
    return Math.abs( a - b ) <= tolerance;
};

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
        var expected = [
            {x:0.0, y:0.0, z:0.0},
            {x:2.475369, y:0.2475369, z:0.2475369},
            {x:4.950738, y:0.4950738, z:0.4950738},
            {x:7.426107, y:0.7426107, z:0.7426107},
            {x:9.901476, y:0.9901476, z:0.9901476},
            {x:8.992775, y:2.813006, z:-0.20867062},
            {x:7.943798, y:4.701164, z:-1.4674425},
            {x:6.894821, y:6.5893216, z:-2.7262144},
            {x:5.8458447, y:8.47748, z:-3.9849863},
            {x:4.718284, y:9.823928, z:-4.647855},
            {x:3.2634978, y:8.914686, z:-2.8293724},
            {x:1.808712, y:8.0054455, z:-1.01089},
            {x:0.3539257, y:7.096204, z:0.80759287},
            {x:-1.1008601, y:6.186962, z:2.6260753},
            {x:-2.555646, y:5.2777214, z:4.444557},
            {x:-3.0, y:5.0, z:5.0}
        ];

        it('should match java output', function(){
            var pts = strip.getDecimatedVertices( step );
            assert.equal( pts.length, expected.length );
            expected.forEach(function( expectedVec, i ){
                var receivedVec = pts[i];
                ['x','y','z'].forEach(function(prop){
                    assert.ok( withTolerance(receivedVec[prop],expectedVec[prop],0.001));
                });
            });
        });
	});

});
