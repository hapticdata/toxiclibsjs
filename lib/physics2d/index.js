module.exports = {
	ParticlePath2D: require('./ParticlePath2D'),
	ParticleString2D: require('./ParticleString2D'),
	PullBackString2D: require('./PullBackString2D'),
	VerletConstrainedSpring2D: require('./VerletConstrainedSpring2D'),
	VerletMinDistanceSpring2D: require('./VerletMinDistanceSpring2D'),
	VerletParticle2D: require('./VerletParticle2D'),
	VerletPhysics2D: require('./VerletPhysics2D'),
	VerletSpring2D: require('./VerletSpring2D')
};

module.exports.behaviors = require('./behaviors');
module.exports.constraints = require('./constraints');