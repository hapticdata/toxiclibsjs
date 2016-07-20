define(["require", "exports", "module", "./physics3d/ParticlePath3D","./physics3d/ParticleString3D","./physics3d/PullBackSpring3D","./physics3d/VerletConstrainedSpring3D","./physics3d/VerletMinDistanceSpring3D","./physics3d/VerletParticle3D","./physics3d/VerletPhysics3D","./physics3d/VerletSpring3D","./physics3d/behaviors","./physics3d/constraints"], function(require, exports, module) {
module.exports = {
	ParticlePath3D: require('./physics3d/ParticlePath3D'),
	ParticleString3D: require('./physics3d/ParticleString3D'),
	PullBackSpring3D: require('./physics3d/PullBackSpring3D'),
	VerletConstrainedSpring3D: require('./physics3d/VerletConstrainedSpring3D'),
	VerletMinDistanceSpring3D: require('./physics3d/VerletMinDistanceSpring3D'),
	VerletParticle3D: require('./physics3d/VerletParticle3D'),
	VerletPhysics3D: require('./physics3d/VerletPhysics3D'),
	VerletSpring3D: require('./physics3d/VerletSpring3D')
};

module.exports.behaviors = require('./physics3d/behaviors');
module.exports.constraints = require('./physics3d/constraints');
});
