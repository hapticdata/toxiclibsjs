define([
    'exports',
    './behaviors/AttractionBehavior',
    './behaviors/ConstantForceBehavior',
    './behaviors/GravityBehavior'
], function( exports, AttractionBehavior, ConstantForceBehavior, GravityBehavior ){
    exports.AttractionBehavior = AttractionBehavior;
    exports.ConstantForceBehavior = ConstantForceBehavior;
    exports.GravityBehavior = GravityBehavior;
});
