module.exports = {
	ParticlePath2D: require('./physics2d/ParticlePath2D'),
	ParticleString2D: require('./physics2d/ParticleString2D'),
	PullBackString2D: require('./physics2d/PullBackString2D'),
	VerletConstrainedSpring2D: require('./physics2d/VerletConstrainedSpring2D'),
	VerletMinDistanceSpring2D: require('./physics2d/VerletMinDistanceSpring2D'),
	VerletParticle2D: require('./physics2d/VerletParticle2D'),
	VerletPhysics2D: require('./physics2d/VerletPhysics2D'),
	VerletSpring2D: require('./physics2d/VerletSpring2D')
};

module.exports.behaviors = require('./physics2d/behaviors');
module.exports.constraints = require('./physics2d/constraints');