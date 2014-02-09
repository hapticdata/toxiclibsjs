define([
    "exports",
    "./constraints/AngularConstraint",
    "./constraints/AxisConstraint",
    "./constraints/CircularConstraint",
    "./constraints/MaxConstraint",
    "./constraints/MinConstraint",
    "./constraints/RectConstraint"
], function( exports, AngularConstraint, AxisConstraint, CircularConstraint, MaxConstraint, MinConstraint, RectConstraint) {
    /** @module toxi/physics2d/constraints */
	exports.AngularConstraint = AngularConstraint;
	exports.AxisConstraint = AxisConstraint;
	exports.CircularConstraint = CircularConstraint;
	exports.MaxConstraint = MaxConstraint;
	exports.MinConstraint = MinConstraint;
	exports.RectConstraint = RectConstraint;
});
