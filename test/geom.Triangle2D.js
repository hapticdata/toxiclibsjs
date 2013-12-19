/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');

var Vec2D = toxi.geom.Vec2D,
	Circle = toxi.geom.Circle,
	Rect = toxi.geom.Rect,
	Triangle2D = toxi.geom.Triangle2D,
	Polygon2D = toxi.geom.Polygon2D;


describe('toxi.geom.Triangle2D', function(){
	function testInstance( t ){
		it('should be a Triangle2D instance', function(){
			assert.ok( t instanceof Triangle2D );
		});
	}
	
	describe('statics', function(){
		describe("createEquilateralFrom()", function(){
			var t = Triangle2D.createEquilateralFrom( new Vec2D(), new Vec2D( 0.5, 1 ) );
			it('should create 3rd point', function(){
				assert.ok( t.c instanceof Vec2D );
			});
		});
		describe("isClockwise()", function(){
			var a  = new Vec2D(), b = new Vec2D( 0.5, 1 );
			var c = Triangle2D.createEquilateralFrom( a, b ).c;
			it('should be clockwise', function(){
				assert.ok(Triangle2D.isClockwise(a,b,c),"isClockwise");
			});
		});
	});
	describe("constructor", function(){
		describe("no params", function(){
			testInstance( new Triangle2D() );
		});
		describe("3 params: a,b,c", function(){
			var a = new Vec2D(0,0),
				b = new Vec2D(0.5,1),
				c = new Vec2D(1,0),
				t = new Triangle2D(a,b,c);
			testInstance( t );
			it('should have copies of a,b,c', function(){
				assert.deepEqual( t.a, a );
				assert.deepEqual( t.b, b );
				assert.deepEqual( t.c, c );
			});

			describe("prototype functions", function(){
				describe("#adjustTriangleSizeBy()", function(){
					describe("1 param", function(){
						var t2 = t.copy().adjustTriangleSizeBy(100);
						it('should have adjusted triangle size by 100', function(){
							assert.ok( t2 instanceof Triangle2D );
						});
					});
					describe("3 params", function(){
						var t2 = t.copy().adjustTriangleSizeBy(100,125,150);
						it('should have adjusted triangle size by a100, b125, c150',function(){
							assert.ok( t2 instanceof Triangle2D );
						});
					});
				});

				describe("#containsPoint()", function(){
					describe("with its own point b", function(){
						it("should be false, presumably because it is not inside the triangle", function(){
							assert.ok( !t.containsPoint(t.b) );
						});
					});
					describe("arbitrary point within",function(){
						it('should be true', function(){
							assert.ok( t.containsPoint(t.a.add(0.25,0.25)) );
						});
					});
					describe("point outside of itself", function(){
						it('should be false', function(){
							assert.ok( !t.containsPoint(new Vec2D(100,1000)) );
						});
					});
				});

				describe("#copy()", function(){
					it("should be a unique copy",function(){
						var t2 = t.copy();
						assert.deepEqual( t, t2 );
						assert.notStrictEqual( t, t2 );
					});
				});

				describe("#flipVertexOrder()", function(){
					var fvot = t.copy();
					it("should have flipped a & c",function(){
						assert.deepEqual( fvot.a,fvot.flipVertexOrder().c );
					});
				});

				describe("#getArea()", function(){
					it("should be a valid area",function(){
						assert.ok(!isNaN(t.getArea()) );
						assert.equal( t.getArea(), -0.5 );
					});
				});

				describe("#getBounds()", function(){
					it("should return rect with positive area",function(){
						var bounds = t.copy().getBounds();
						assert.ok(bounds instanceof Rect );
						assert.ok(bounds.getArea() > 0 );
					});
				});

				describe("#getCircumCircle()", function(){
					it("should return a circle",function(){
						var circle = t.copy().getCircumCircle();
						assert.ok(circle instanceof Circle);
						assert.ok(circle.getRadius() > 0 );
					});
				});

				describe("#getCircumference()", function(){
					it("it should have a positive circumference",function(){
						var circumference = t.copy().getCircumference();
						assert.ok(circumference > 0, "return circumference: "+circumference);
						assert.ok( circumference > 3.2360 && circumference < 3.2361 );
					});
				});

				describe("#getClosestPointTo( new Vec2D(1,1) )", function(){
					it("should be a Vec2D",function(){
						var _p = new Vec2D(1,1);
						var closest = t.getClosestPointTo(_p);
						assert.ok( closest !== undefined );
						assert.ok( closest instanceof Vec2D );
					});
				});

				describe("#intersectsTriangle( tri )", function(){
					it("should intersect", function(){
						var newTri = Triangle2D.createEquilateralFrom(new Vec2D(-0.5,-0.5),new Vec2D(2,2));
						assert.ok(t.intersectsTriangle(newTri));
					});
					it('should not intersect', function(){
						var newTri = Triangle2D.createEquilateralFrom(new Vec2D(-100,-100), new Vec2D(-90,-90));
						assert.ok(!t.intersectsTriangle(newTri));
					});
				});

				describe("#isClockwise()", function(){
					it("should be tru",function(){
						assert.ok( t.isClockwise() );
					});
				});

				describe("#toPolygon2D()", function(){
					it("should be a Polygon2D",function(){
						assert.ok( t.toPolygon2D() instanceof Polygon2D );
					});
					it('should have 3 vertices', function(){
						assert.equal( t.toPolygon2D().vertices.length, 3 );
					});
				});
			});
		});
	});
});