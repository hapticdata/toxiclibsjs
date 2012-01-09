define(["require", "exports", "module", "./constraints/AngularConstraint","./constraints/AxisConstraint","./constraints/CircularConstraint","./constraints/MaxConstraint","./constraints/MinConstraint","./constraints/RectConstraint"], function(require, exports, module) {
/** @module toxi/physics2d/constraints */
module.exports = {
	AngularConstraint: require('./constraints/AngularConstraint'),
	AxisConstraint: require('./constraints/AxisConstraint'),
	CircularConstraint: require('./constraints/CircularConstraint'),
	MaxConstraint: require('./constraints/MaxConstraint'),
	MinConstraint: require('./constraints/MinConstraint'),
	RectConstraint: require('./constraints/RectConstraint')
};
});
