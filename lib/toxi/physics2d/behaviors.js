define(["require", "exports", "module", "./behaviors/AttractionBehavior","./behaviors/ConstantForceBehavior","./behaviors/GravityBehavior"], function(require, exports, module) {
/** @module toxi/physics2d/behaviors */
module.exports = {
	AttractionBehavior: require('./behaviors/AttractionBehavior'),
	ConstantForceBehavior: require('./behaviors/ConstantForceBehavior'),
	GravityBehavior: require('./behaviors/GravityBehavior')
};
});
