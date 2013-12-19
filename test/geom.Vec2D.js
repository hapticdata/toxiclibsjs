/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');


var Vec2D = toxi.geom.Vec2D,
	Rect = toxi.geom.Rect,
	Triangle2D = toxi.geom.Triangle2D,
	SigmoidInterpolation = toxi.math.SigmoidInterpolation;



describe("toxi.geom.Vec2D", function(){
	describe("constructor", function(){
		describe("0 params", function(){
			it('should be 0,0', function(){
				var vec = new Vec2D();
				assert.ok(vec instanceof Vec2D, "vec: "+vec);
				assert.equal( vec.x, 0 );
				assert.equal( vec.y, 0 );
			});
		});
		describe("2 params, x,y", function(){
			var vec = new Vec2D( 5, 10 );
			it("should retain coords", function(){
				assert.equal( vec.x, 5 );
				assert.equal( vec.y, 10 );
			});
		});
		describe("1 param, Vec2D", function(){
			var vec = new Vec2D( new Vec2D( 5, 10 ) );
			it("should be new copy", function(){
				assert.equal( vec.x, 5 );
				assert.equal( vec.y, 10 );
			});
		});
	});

	describe("prototype functions", function(){
		var v = new Vec2D(100,150);
		describe("#addSelf( vec2D )", function(){
			it("should copy sums of x,y", function(){
				var v1 = v.copy();
				var v2 = v1.addSelf({x: 25, y: 50});
				assert.equal(v1.x, 125);
				assert.equal(v1.y, 200);
				assert.strictEqual(v1, v2 );
			});
		});
		describe("#add( vec2d )", function(){
			it("should be a new object", function(){
				var v2 = v.add(100,150);
				assert.equal(v2.x, 200 );
				assert.equal(v2.y, 300);
				assert.notStrictEqual(v2,v);
			});
		});

		describe("#angleBetween( v )", function(){
			it("should be valid angle", function(){
				var pos1 = new Vec2D(20,20),
				pos2 = pos1.scale(0.5);		
				var angle = pos2.angleBetween(pos1,true);
				assert.ok(!isNaN(angle) );
			});
		});

		describe("#clear(), #compareTo() & #isZeroVector()", function(){
			it("should be 0 vector", function(){
				var vec = new Vec2D(100,100);
				vec.clear();
				assert.ok(vec.isZeroVector());
				assert.equal( vec.compareTo(new Vec2D()), 0 );
			});
		});

		describe("#compareTo()", function(){
			it("should equal distance between", function(){
				var vec1 = new Vec2D(200,200);
				var vec2 = new Vec2D(100,100);
				var mag = (vec1.x * vec1.x + vec1.y * vec1.y) - (vec2.x * vec2.x + vec2.y * vec2.y);
				var magCompareTo = vec1.compareTo(vec2);
				assert.equal(magCompareTo, mag);
			});
		});
		describe("#max() & #equals()", function(){
			it("should pass max value", function(){
				var vec1 = new Vec2D(100,100);
				var vec2 = new Vec2D(200,200);
				var vec3 = vec2.max(vec1);
				assert.ok(vec3.equals(vec2));
			});
		});

		describe("#constrain( rect )", function(){
			var vec1 = new Vec2D(5,5);
			var vec2 = new Vec2D(200,200);
			var constrainRect = new Rect(10,10,50,50);
			var constrained2 = vec2.constrain(constrainRect);
			var constrained1 = vec1.constrain(constrainRect);
			it("should clip points to rect bounds", function(){
				assert.equal(constrained2.x, 60);
				assert.equal(constrained2.y,60);
				assert.equal(constrained1.x, 10);
				assert.equal(constrained1.y, 10);
			});
		});
		describe("#constrain( min, max )", function(){
			var vec1 = new Vec2D(5,5);
			var vec2 = new Vec2D(200,200);
			var min = new Vec2D(10,10);
			var max = new Vec2D(60,60);
			var constrained2 = vec2.constrain(min,max);
			var constrained1 = vec1.constrain(min,max);
			it("should clip points", function(){
				assert.equal(constrained2.x, 60);
				assert.equal(constrained2.y, 60);
				assert.equal(constrained1.x, 10);
				assert.equal(constrained1.y, 10);
			});
		});
		describe("#copy()", function(){
			it("should be a unique object", function(){
				var v1 = v.copy();
				assert.notStrictEqual( v1, v );
				assert.deepEqual( v1, v );
			});
		});
		describe("#cross()", function(){
			it("should be a valid cross-product", function(){
				var vec = new Vec2D(100,100);
				var cross = vec.cross(new Vec2D(0,10));
				assert.equal( cross, 1000 );
			});
		});
		describe("#distanceTo( v )", function(){
			var vec2 = new Vec2D( 300, 300 );
			var distance = vec2.distanceTo(v);
			it("should be valid distance", function(){
				assert.ok( distance > 0 );
			});
		});
		describe("#equalsWithTolerance( t )", function(){
			it("should be equal", function(){
				assert.ok(v.equalsWithTolerance( v.sub(8),10) );
			});
			it("should not be equal", function(){
				assert.ok( !v.equalsWithTolerance( new Vec2D(5,5) ,10) );
			});
		});
		describe("#getComponent( x|y )", function(){
			it("should return correct property", function(){
				assert.equal(v.getComponent(1), v.y );
				assert.equal(v.getComponent(Vec2D.Axis.Y), v.y );
			});
		});
		describe("#interpolateTo( v, progress )", function(){
			var vec2 = new Vec2D( 300, 300 );
			var halfBetween = v.interpolateTo(vec2,0.5);
			it("should be a valid interpolation", function(){
				assert.deepEqual( halfBetween, v.add( vec2.sub(v).scaleSelf(0.5) ) );
			});
		});
		describe("interpolateTo( v, progress, interp )", function(){
			var vec2 = new Vec2D( 300, 300 );
			var sigBetween = v.interpolateTo(vec2,0.35, new SigmoidInterpolation());
			it("should be valid interpolation", function(){
				assert.ok(!sigBetween.isZeroVector() );
			});
		});
		describe("#interpolateToSelf( v, pro )", function(){
			var v1 = v.copy();
			var v2 = v.add( 300, 300 );
			var halfBetween = v1.interpolateToSelf(v2,0.5);
			it("should be a valid interpolation", function(){
				assert.strictEqual( v1, halfBetween );
				assert.deepEqual( v1, v.add( v2.sub(v).scaleSelf(0.5) ) );
			});
		});
		describe("#interpolateToSelf( v, prog, interp )", function(){
			var vec = new Vec2D(100,70);
			var vecc = new Vec2D(50,50);
			var vecc2 = vecc.interpolateToSelf(vec,0.3,new SigmoidInterpolation());
			it("should interpolate in same object", function(){
				assert.strictEqual(vecc,vecc2);
				assert.ok( !vecc2.isZeroVector() );
			});
		});
		describe("#isInRectangle( rect )", function(){
			var vec = new Vec2D();
			var rect = new Rect(-10,-10,20,20);
			var rect2 = new Rect(10,10,20,20);
			it("should be true", function(){
				assert.ok( vec.isInRectangle(rect) );
			});
			it("should be false", function(){
				assert.ok( !vec.isInRectangle(rect2) );
			});
		});
		describe("#isInTriangle( a, b, c)", function(){
			var v = new Vec2D();
			var tri1 = new Triangle2D(new Vec2D(-1,1), new Vec2D(0,-1), new Vec2D(1,1));
			var tri2 = new Triangle2D(new Vec2D(1,1), new Vec2D(2,25), new Vec2D(3,40));
			it("should be within triangle", function(){
				assert.ok( v.isInTriangle(tri1.a,tri1.b,tri1.c) );
			});
			it("should be outside triangle", function(){
				assert.ok( !v.isInTriangle(tri2.a,tri2.b,tri2.c) );
			});
		});
		describe("#isMajorAxis( tolerance )", function(){
			it("should", function(){
				var vec = new Vec2D();
				assert.ok( !vec.isMajorAxis( 0.5 ) );
			});
		});

		describe("#jitter", function(){
			var v = new Vec2D();
			var jitVec = new Vec2D(1,1);

			describe("( x,y )", function(){
				var vec = v.copy();
				vec.jitter(jitVec.x,jitVec.y);
				it("should move within range", function(){
					assert.ok( vec.x !== 0 && vec.y !== 0 );
					assert.ok( vec.x <= jitVec.x && vec.x >= -jitVec.x, vec.x +' : ' + jitVec.x );
					assert.ok( vec.y <= jitVec.y && vec.y >= -jitVec.y );

				});
			});
			describe("( vec2d )", function(){
				var vec = v.copy();
				vec.jitter( jitVec );
				it("should move within range", function(){
					assert.ok( vec.x !== 0 && vec.y !== 0 );
					assert.ok( vec.x <= jitVec.x && vec.x >= -jitVec.x, vec.x +' : ' + jitVec.x );
					assert.ok( vec.y <= jitVec.y && vec.y >= -jitVec.y );
				});
			});
			describe("({x: 1, y: 1})", function(){
				var vec = v.copy();
				vec.jitter({x: jitVec.x, y: jitVec.y });
				it("should move within range", function(){
					assert.ok( vec.x !== 0 && vec.y !== 0 );
					assert.ok( vec.x <= jitVec.x && vec.x >= -jitVec.x, vec.x +' : ' + jitVec.x );
					assert.ok( vec.y <= jitVec.y && vec.y >= -jitVec.y );
				});
			});
		});

		describe("#limit( lim )", function(){
			var vec = new Vec2D(3,3);
			var vecCopy = vec.copy();
			it("should not have been limited", function(){
				assert.ok( vecCopy.equals(vec.limit(10)) );
			});
			it("should have been limited and changed", function(){
				assert.deepEqual( vec.limit(2), vecCopy.normalize().scaleSelf(2) );
			});
		});
		describe("#positiveHeading()", function(){
			var vec = new Vec2D( 20, 20 );
			it("should match java output", function(){
				var p = vec.positiveHeading();
				assert.ok( p > 0.785 && p < 0.786, p );
			});
		});
		describe("#reflect( normal )", function(){
			it("should match java output", function(){
				var vec = new Vec2D(2,2);
				var normal = new Vec2D(10,10);
				var reflected = vec.reflect( normal );
				assert.equal( reflected.x, 798.0 );
				assert.equal( reflected.y, 798.0 );
			});
		});
		describe("#rotate( ang )", function(){
			it("should rotate point", function(){
				var vec = new Vec2D(10,10);
				var rotated = vec.rotate(Math.PI/2);
				assert.deepEqual( rotated, new Vec2D(-10,10) );
			});
		});
		describe("#setComponent( id, val )", function(){
			it("should set property", function(){
				var vec = new Vec2D();
				assert.deepEqual(new Vec2D(10,0), vec.setComponent(0,10) );
				assert.deepEqual( new Vec2D(10,0), vec.setComponent(Vec2D.Axis.X,10) );
			});
		});
		describe("#signum()", function(){
			var vec0 = new Vec2D().signum();
			var vec1 = new Vec2D(10,10).signum();
			var vec2 = new Vec2D(-10,10).signum();
			var vec3 = new Vec2D(-10,-10).signum();
			it("should equal zero vector", function(){
				assert.ok( vec0.isZeroVector() );
			});
			it("should be 1,1", function(){
				assert.deepEqual(vec1, new Vec2D(1,1) );
			});
			it("should be -1, 1", function(){
				assert.deepEqual(vec2, new Vec2D(-1,1) );
			});
			it("should be -1, -1", function(){
				assert.deepEqual(vec3, new Vec2D(-1,-1) );
			});
		});

		describe("#tangentNormalOfEllipse( ellipseOrigin, ellipseRadius", function(){
			it("should match java output", function(){
				var eO = new Vec2D();
				var eR = new Vec2D(100,100);	
				var tan = v.tangentNormalOfEllipse(eO,eR);	
				assert.ok( tan.x > 0.554 && tan.x < 0.555 );
				assert.ok( tan.y > 0.832 && tan.y < 0.833 );
			});
		});

		describe("#toCartesian()", function(){
			var vec = new Vec2D(100, Math.PI);
			it("should be proper cartesian", function(){
				var c = vec.toCartesian();
				var x = (vec.x * Math.cos( vec.y ) );
				var y = (vec.x * Math.sin( vec.y ) );
				assert.ok( c.equalsWithTolerance(new Vec2D( x,y ), 0.0001 ) );
			});
		});
	});
});
