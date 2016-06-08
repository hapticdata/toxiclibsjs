define(["require", "exports", "module", "./constraints/AxisConstraint","./constraints/BoxConstraint","./constraints/CylinderConstraint","./constraints/MaxConstraint","./constraints/MinConstraint","./constraints/ParticleConstraint3D","./constraints/PlaneConstraint","./constraints/SoftBoxConstraint","./constraints/SphereConstraint",], function(require, exports, module) {
/** @module toxi/physics2d/constraints */
module.exports = {
	AxisConstraint: require('./constraints/AxisConstraint'),
	BoxConstraint: require('./constraints/BoxConstraint'),
	CylinderConstraint: require('./constraints/CylinderConstraint'),
	MaxConstraint: require('./constraints/MaxConstraint'),
	MinConstraint: require('./constraints/MinConstraint'),
	PlaneConstraint: require('./constraints/PlaneConstraint'),
	SoftBoxConstraint: require('./constraints/SoftBoxConstraint'),
	SphereConstraint: require('./constraints/SphereConstraint')
};
});
