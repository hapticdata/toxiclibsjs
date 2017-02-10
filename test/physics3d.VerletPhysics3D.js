/*global describe, it*/
var toxi = require('./index'),
	assert = require('assert');



var VerletPhysics3D = toxi.physics3d.VerletPhysics3D,
	VerletParticle3D = toxi.physics3d.VerletParticle3D,
	GravityBehavior = toxi.physics3d.behaviors.GravityBehavior,
	SphereConstraint = toxi.physics3d.constraints.SphereConstraint,
	Vec3D = toxi.geom.Vec3D;


describe.only("toxi.physics3d.VerletPhysics3D", function(){
	describe("constructors", function(){
		function testDefaults( p ){
			it('should have default numIterations', function(){
				assert.equal( p.numIterations, 50 );
			});
			it('should have default drag', function(){
				assert.equal( p.getDrag(), 1.0);
			});
			it('should have default timeStep', function(){
				assert.equal( p.getTimeStep(), 1 );
			});
			/*it('should have no behaviors', function(){
				assert.equal( p.behaviors.length, 0 );
			});*/
		}
		function testGravity( p ){
			it("should have gravity and default properties", function(){
				assert.equal( p.behaviors.length, 1 );
			});
		}
		describe("no params", function(){
			var p = new VerletPhysics3D();
			it('should be a valid instance', function(){
				assert.ok( p instanceof VerletPhysics3D );
			});
			testDefaults( p );
		});
		// describe("1 param gravity behavior", function(){
		// 	var grav = new GravityBehavior( new Vec3D( 0, 0.1) );
		// 	var p = new VerletPhysics3D( grav );
		// 	testGravity( p );
		// 	testDefaults( p );
		// });
		describe("1 param, Vec3D as gravity", function(){
			var p = new VerletPhysics3D( new Vec3D( 0, 0.1, 0 ) );
			testDefaults( p );
			testGravity( p );
		});
		describe("1 param, options object, all properties", function(){
			var p = new VerletPhysics3D({
				gravity: new Vec3D(0.1,-1, 0),
				drag: 0.05,
				timeStep: 2,
				numIterations: 25
			});
			testGravity( p );
			it('should have defined properties', function(){
				assert.ok( Math.abs(p.getDrag() - 0.05) < 0.00001 ); //floating-point precision issue
				assert.equal( p.getTimeStep(), 2 );
				assert.equal( p.getNumIterations(), 25 );
			});
		});

		describe("1 param, options object w/ drag and timeStep", function(){
			var p = new VerletPhysics3D({
				drag: 0.05,
				timeStep: 2
			});
			it("should have set properties and default others", function(){
				assert.equal( p.behaviors.length, 0 );
				assert.ok( Math.abs(p.getDrag() - 0.05) < 0.00001 ); //floating-point precision issue
				assert.equal( p.getTimeStep(), 2 );
				assert.equal( p.getNumIterations(), 50 );
			});
		});
	});


	describe("#update()", function(){

		it("should complete an update loop, and apply GravityBehavior", function(){
			var physics = new VerletPhysics3D(new Vec3D(0, -0.1, 0));
			for(var i=0; i<10; i++){
				physics.addParticle(new VerletParticle3D(new Vec3D(Math.random(), 0, Math.random())));
			}

			physics.update();

			var allLower = true;
			physics.particles.forEach(function(p){
				if(p.y >= 0){
					allLower = false;
				}
			});
			assert.ok(allLower);
		});

		it("should complete an update loop, and apply a constraint", function(){
			var physics = new VerletPhysics3D(new Vec3D(0, 0.1, 0));
			for(var i=0; i<10; i++){
				physics.addParticle(new VerletParticle3D(Vec3D.randomVector()));
			}

			var constraint = new SphereConstraint(new Vec3D(), 1, 0.1);
			physics.addConstraint(constraint);
			physics.update();
			assert.ok(true);
        });
	});
});
