define(["require", "exports", "module", "../../internals","./VertexSelector"], function(require, exports, module) {
var extend = require('../../internals').extend,
    VertexSelector = require('./VertexSelector');
/**
 * @class
 * @member toxi
 * @augments toxi.VertexSelector
 */
var DefaultSelector = function(mesh){
	VertexSelector.apply(this,[mesh]);
};
extend(DefaultSelector,VertexSelector);	
DefaultSelector.prototype.selectVertices = function(){
	this.clearSelection();
	this.selection.addAll(this.mesh.getVertices());
	return this;
};

module.exports = DefaultSelector;
});
