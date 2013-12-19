/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

var Rect = toxi.geom.Rect,
	Ray2D = toxi.geom.Ray2D,
	Vec2D = toxi.geom.Vec2D;


describe('toxi.geom.Rect', function(){

	function testRect( r ){
		it('should be a Rect', function(){
			assert.equal( true, r instanceof Rect );
		});
		it('should hold correct position and dimensions', function(){
			assert.equal( r.x, pos.x );
			assert.equal( r.y, pos.y );
			assert.equal( r.getDimensions().x, ext.x );
			assert.equal( r.getDimensions().y, ext.y );
		});
	}

	var pos = new Vec2D( 10, 15 ); //position
	var ext = new Vec2D( 100, 50 ); //extent
	describe('constructor', function(){
		describe('2 params: posVec2D, pos2Vec2D', function(){
			// {x1 | y1}, {x2 | y2}
			testRect( new Rect(pos, ext.add( pos ) ) );
		});
		describe('4 params: x, y, width, height', function(){
			testRect( new Rect( pos.x, pos.y, ext.x, ext.y ) );
		});
		describe('1 param: param object', function(){
			testRect( new Rect({ x: pos.x, y: pos.y, width: ext.x, height: ext.y }) );
		});
	});

	describe('#intersectsRay()', function(){
		var r = new Rect(30,50,100,100);
		var ray2d = new Ray2D(60,70,new Vec2D(Math.PI/1.5,0));
		var intersect = r.intersectsRay(ray2d,0,3.4028235E38);
		var invDir = ray2d.getDirection().reciprocal();
		var signDirX = invDir.x < 0;
		var signDirY = invDir.y < 0;
		var min = r.getTopLeft();
		var max = r.getBottomRight();
		var minDist = 0;
		var maxDist = 3.4028235E38;
		var bbox = signDirX ? max : min;
		var txmin = (bbox.x - ray2d.x) * invDir.x;
		var txmax = (bbox.x - ray2d.x) * invDir.x;
		var tymin = (bbox.y - ray2d.y) * invDir.y;
		bbox = signDirY ? min : max;
		var tymax = (bbox.y - ray2d.y) * invDir.y;
		//console.log("intersect: "+intersect);
		//console.log("invDir: "+invDir);
		//console.log("txmin: "+txmin+",txmax: "+txmax);
		//console.log("tymin: "+tymin+ ", tymax: "+tymax);
		if((txmin > tymax) || (tymin > txmax)){
			assert.fail("impossible intersection");
		}
		if(tymin > txmin){
			txmin = tymin;
		}
		if (tymax < txmax) {
			txmax = tymax;
		}
		if ((txmin < maxDist) && (txmax > minDist)) {
		//	console.log("final: "+ray2d.getPointAtDistance(txmin));
		}
		assert.equal( true, (txmin < maxDist) );
		//assert.equal( true, (txmax > minDist) );
		assert.equal( intersect.x, r.x );
		assert.deepEqual( { x: r.x, y: ray2d.y }, ray2d.getPointAtDistance( txmin ) );
	});
});

