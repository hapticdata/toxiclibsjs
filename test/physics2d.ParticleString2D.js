/*global describe, it*/
var toxi = require('../index'),
	assert = require('assert');



var p = toxi.physics2d;

describe("toxi.physics2d.ParticleString2D", function(){
	describe("ParticleString2D( physics:VerletPhysics2D, plist:VerletParticle2D[], strength:Number)", function(){
        it('should include provided particles, and connect with springs', function(){
            var physics, pstring, plist = [], n = 10;
            physics = new p.VerletPhysics2D();
            //make the particles
            for( var i=0; i<n; i++ ){
                plist.push( new p.VerletParticle2D() );
            }
            //construct the ParticleString
            pstring = new p.ParticleString2D( physics, plist, 1.0 );
            //assertions
            assert.ok( pstring instanceof p.ParticleString2D );
            assert.equal( pstring.particles.length, n );
            assert.equal( physics.particles.length, pstring.particles.length );
            //should have 1-less spring than particle
            assert.equal( pstring.links.length, n-1 );
            assert.equal( physics.springs.length, pstring.links.length);
        });
    });
});
