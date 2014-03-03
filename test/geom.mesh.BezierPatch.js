var toxi= require('../index'),
    assert = require('assert');

var BezierPatch = toxi.geom.mesh.BezierPatch,
    Vec3D = toxi.geom.Vec3D,
    TriangleMesh = toxi.geom.mesh.TriangleMesh;


var randPatch = function(){
    var pts = [];
    for( var i=0; i<4; i++ ){
        pts[i] = [];
        for( var j=0; j<4; j++ ){
            pts[i][j] = Vec3D.randomVector();
        }
    }
    return pts;
};

describe('toxi.geom.mesh.BezierPatch', function(){

    describe('constructor', function(){
        var testInstance = function( bp ){
            assert.ok( bp instanceof BezierPatch );
            assert.ok( bp.points.length <= 4 );
            assert.equal( typeof bp.computePointAt, 'function');
            assert.equal( typeof bp.set, 'function');
            assert.equal( typeof bp.toMesh, 'function');
            assert.ok( bp.points[0].length <= 4 );
            for( var i=0; i<4; i++ ){
                for( var j=0; j<4; j++ ){
                    assert.ok( bp.points[i][j] instanceof Vec3D );
                }
            }
        };
        describe('no parameters', function(){
            it('should create a multi-dimensonal points array of Vec3Ds', function(){
                var bp = new BezierPatch();
                testInstance( bp );
            });
        });
        describe('with points', function(){
            it('should accept points provided', function(){
                var pts = randPatch(),
                    sample = pts[0][0],
                    bp;
                bp = new BezierPatch(pts);
                testInstance( bp );
                assert.deepEqual( pts, bp.points );
                assert.deepEqual( sample, bp.points[0][0] );
            });
        });
    });

    describe('#set( x, y, point ):BezierPatch', function(){
        it('should set the point on the patch', function(){
            var x = 1, y = 2, pt = Vec3D.randomVector();
            var bp = new BezierPatch();
            bp.set( x, y, pt );
            assert.deepEqual( pt, bp.points[y][x] );
        });
    });


    describe('#toMesh( mesh_or_resolution, [resolution] ):TriangleMesh', function(){
        it('should generate a mesh from points', function(){
            var bp = new BezierPatch( randPatch() );
            var mesh = bp.toMesh( 8 );
            assert.ok( mesh instanceof TriangleMesh );
        });
    });
});


