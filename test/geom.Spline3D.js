/*global describe, it*/
var toxi = require('../index'),
    assert = require('assert');
//TODO: test Spline3D#getDecimatedVertices()
describe("Spline3D", function(){
    describe('default instance', function(){
        var instance = new toxi.geom.Spline3D();
        it('should have default tightness', function(){
            assert.equal(instance.getTightness(), toxi.geom.Spline3D.DEFAULT_TIGHTNESS);
        });

        describe('#add()', function(){
            it('should add vertices', function(){
                var length = 10;
                getNVec3D( length ).forEach(function( v ){
                    instance.add( toxi.geom.Vec3D.randomVector() );
                });
                assert.equal( instance.getNumPoints(), length );
                assert.equal( instance.pointList.length, length );
            });
        });

        testInstance( instance );
    });
    describe('instance with points in constructor', function(){
        var instance = new toxi.geom.Spline3D( getNVec3D( 10 ) );
        testInstance( instance );
    });
    describe('instance with points and custom bernstein polynomial', function(){
        var instance = new toxi.geom.Spline3D( getNVec3D(10), new toxi.geom.BernsteinPolynomial( 12 ) );
        assert.equal(instance.bernstein.resolution, 12 );
        testInstance( instance );
    });
    describe('instance with points and custom bernstein polynomial and tightntess', function(){
        var instance = new toxi.geom.Spline3D( getNVec3D(10), new toxi.geom.BernsteinPolynomial( 14 ), 0.5 );
        it('should have the bernstein.resolution set', function(){
            assert.equal(instance.bernstein.resolution, 14 );
        });
        it('should have the tightness set', function(){
            assert.equal(instance.getTightness(), 0.5 );
        });
        testInstance( instance );
    });

    describe('instance with an options object', function(){
        var instance = new toxi.geom.Spline3D({
            points: getNVec3D( 25 ),
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

    describe('example instance with java output for comparison', function(){
        var Vec3D = toxi.geom.Vec3D;
        var spline = new toxi.geom.Spline3D();
        spline.add (new Vec3D( 0.5, 0.0, 0.0 ) );
        spline.add( new Vec3D( 0.65, 0.25, 0.5 ) );
        spline.add( new Vec3D( 0.5, 0.5, 0.65 ) );
        spline.add( new Vec3D( 0.35, 0.75, 0.5 ) );
        spline.add( new Vec3D( 0.5, 1.0, 0.0 ) );


        var eachNear = function(res){
            return function(v, i){
                assert.ok( v.equalsWithTolerance(expected[res][i], 0.01) );
            };
        };
        var expected = {
            4: [{x:0.5, y:0.0, z:0.0}, {x:0.5204241, y:0.023995537, z:0.05527344}, {x:0.56696427, y:0.08482143, z:0.1890625}, {x:0.6175223, y:0.16573662, z:0.3533203}, {x:0.65, y:0.25, z:0.5}, {x:0.6476562, y:0.32421875, z:0.5919922}, {x:0.6151786, y:0.38839284, z:0.6359375}, {x:0.5626116, y:0.44587052, z:0.64941406}, {x:0.5, y:0.5, z:0.65}, {x:0.4373884, y:0.5541295, z:0.64941406}, {x:0.38482141, y:0.6116072, z:0.63593745}, {x:0.35234374, y:0.67578125, z:0.59199214}, {x:0.35, y:0.75, z:0.5}, {x:0.38247767, y:0.8342634, z:0.35332033}, {x:0.43303573, y:0.91517854, z:0.1890625}, {x:0.47957587, y:0.9760045, z:0.055273443}, {x:0.5, y:1.0, z:0.0}],
            8: [{x:0.5, y:0.0, z:0.0}, {x:0.5055664, y:0.0063476567, z:0.014819336}, {x:0.5204241, y:0.023995537, z:0.05527344}, {x:0.5418108, y:0.050851006, z:0.115356445}, {x:0.56696427, y:0.08482143, z:0.1890625}, {x:0.5931222, y:0.12381418, z:0.27038574}, {x:0.6175223, y:0.16573662, z:0.3533203}, {x:0.6374023, y:0.2084961, z:0.43186036}, {x:0.65, y:0.25, z:0.5}, {x:0.6532226, y:0.28857422, z:0.5531006}, {x:0.6476562, y:0.32421875, z:0.5919922}, {x:0.63455635, y:0.35735214, z:0.61887205}, {x:0.6151786, y:0.38839284, z:0.6359375}, {x:0.59077847, y:0.41775948, z:0.64538574}, {x:0.5626116, y:0.44587052, z:0.64941406}, {x:0.5319336, y:0.47314453, z:0.6502197}, {x:0.5, y:0.5, z:0.65}, {x:0.4680664, y:0.52685547, z:0.65021974}, {x:0.4373884, y:0.5541295, z:0.64941406}, {x:0.40922156, y:0.5822405, z:0.64538574}, {x:0.38482141, y:0.6116072, z:0.63593745}, {x:0.36544365, y:0.64264786, z:0.61887205}, {x:0.35234374, y:0.67578125, z:0.59199214}, {x:0.34677735, y:0.7114258, z:0.5531006}, {x:0.35, y:0.75, z:0.5}, {x:0.36259764, y:0.7915039, z:0.43186036}, {x:0.38247767, y:0.8342634, z:0.35332033}, {x:0.4068778, y:0.87618583, z:0.27038574}, {x:0.43303573, y:0.91517854, z:0.1890625}, {x:0.45818916, y:0.949149, z:0.11535645}, {x:0.47957587, y:0.9760045, z:0.055273443}, {x:0.49443358, y:0.99365234, z:0.014819337}, {x:0.5, y:1.0, z:0.0}],
            13: [{x:0.5, y:0.0, z:0.0}, {x:0.5021751, y:0.0024546464, z:0.005757853}, {x:0.50827104, y:0.0094934665, z:0.02209832}, {x:0.51764417, y:0.020628782, z:0.04762176}, {x:0.52965087, y:0.035372917, z:0.08092856}, {x:0.5436471, y:0.053238183, z:0.12061903}, {x:0.5589895, y:0.07373691, z:0.16529359}, {x:0.57503414, y:0.09638144, z:0.2135526}, {x:0.5911373, y:0.12068406, z:0.2639964}, {x:0.6066551, y:0.14615712, z:0.31522533}, {x:0.62094414, y:0.1723129, z:0.36583978}, {x:0.6333604, y:0.19866377, z:0.41444016}, {x:0.64326024, y:0.22472203, z:0.45962676}, {x:0.65, y:0.25, z:0.5}, {x:0.6530918, y:0.27410755, z:0.53447884}, {x:0.65267247, y:0.29704466, z:0.56325674}, {x:0.6490344, y:0.31890887, z:0.58684564}, {x:0.6424703, y:0.33979782, z:0.60575795}, {x:0.6332725, y:0.35980877, z:0.62050515}, {x:0.6217342, y:0.37903965, z:0.63159996}, {x:0.60814744, y:0.39758763, z:0.6395539}, {x:0.59280515, y:0.41555044, z:0.6448794}, {x:0.57599974, y:0.43302557, z:0.6480883}, {x:0.5580239, y:0.45011052, z:0.6496928}, {x:0.53917027, y:0.4669029, z:0.6502048}, {x:0.51973146, y:0.4835002, z:0.6501365}, {x:0.5, y:0.5, z:0.65}, {x:0.48026854, y:0.5164998, z:0.65013653}, {x:0.46082973, y:0.53309715, z:0.65020484}, {x:0.441976, y:0.54988945, z:0.6496927}, {x:0.42400032, y:0.5669745, z:0.64808834}, {x:0.40719482, y:0.5844495, z:0.6448793}, {x:0.3918526, y:0.60241246, z:0.63955396}, {x:0.37826583, y:0.6209605, z:0.6315999}, {x:0.3667274, y:0.6401912, z:0.6205052}, {x:0.35752976, y:0.6602022, z:0.60575783}, {x:0.3509656, y:0.68109107, z:0.58684564}, {x:0.34732753, y:0.70295537, z:0.56325674}, {x:0.3469081, y:0.7258924, z:0.5344788}, {x:0.35, y:0.75, z:0.5}, {x:0.35673967, y:0.7752779, z:0.4596268}, {x:0.36663958, y:0.8013363, z:0.41444018}, {x:0.37905583, y:0.827687, z:0.36583975}, {x:0.39334485, y:0.85384303, z:0.31522536}, {x:0.40886268, y:0.87931585, z:0.2639963}, {x:0.4249659, y:0.90361863, z:0.21355262}, {x:0.44101048, y:0.92626315, z:0.16529357}, {x:0.45635283, y:0.94676185, z:0.120619036}, {x:0.47034916, y:0.9646271, z:0.080928534}, {x:0.4823558, y:0.9793712, z:0.047621757}, {x:0.491729, y:0.99050653, z:0.022098316}, {x:0.49782497, y:0.99754536, z:0.0057578515}, {x:0.5, y:1.0, z:0.0}]
        };
        var forRes = function( res ){
            var verts = spline.computeVertices(res);
            assert.equal(verts.length, expected[res].length);
            verts.forEach(eachNear(res));
        };
        it('should match the java output', function(){
            forRes(4);
        });
        it('should match for 8 points', function(){
            forRes(8);
        });
        it('should match for 13 points', function(){
            forRes(13);
        });
    });

    function getNVec3D( n ){
        var points = [];
        for(var i=0; i<n; i++){
            points.push( toxi.geom.Vec3D.randomVector() );
        }
        return points;
    }

    //run these tests on each instance
    function testInstance( instance ){
        it('should be a valid instance', function(){
            assert.equal(instance instanceof toxi.geom.Spline3D, true);
            assert.equal(typeof instance.setTightness, 'function');
            assert.equal(typeof instance.getEstimatedArcLength, 'function');
            assert.equal(instance.computeVertices, toxi.geom.Spline3D.prototype.computeVertices);
        });
        describe('compute vertices', function(){
            //test these resolutions
            [2,3,4,5,6,7,8,9,10,20].forEach(function( res ){
                it('for resolution ' + res, function(){
                    var vertices = instance.computeVertices( res );
                    assert.equal( vertices.length, instance.getNumPoints() * res - (res-1) );
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
