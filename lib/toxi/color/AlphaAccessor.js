define(["require", "exports", "module"], function(require, exports, module) {

var AlphaAccessor = function(){};
AlphaAccessor.prototype = {
	compare: function(a,b){
		var aa = a.alpha(),
			ba = b.alpha();
		return aa < ba ? -1 : aa > ba ? 1 : 0;
	},

	getComponentValueFor: function(col){
		return col.alpha();
	},
	setComponentValueFor: function(col, value){
		col.setAlpha(value);
	}
};

module.exports = AlphaAccessor;
});
