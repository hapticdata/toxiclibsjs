define(function(require, exports, module) {
	var extend = require('../../internals').extend,
		VertexSelector = require('./VertexSelector');
	/**
	 * @class
	 * @member toxi
	 * @augments toxi.VertexSelector
	 */
	var DefaultSelector = function(mesh){
		VertexSelector.call(this,mesh);
	};
	extend(DefaultSelector,VertexSelector);
	DefaultSelector.prototype.selectVertices = function(){
		this.clearSelection();
		this.selection = this.selection.concat( this.mesh.getVertices() );
		return this;
	};

	module.exports = DefaultSelector;
});
