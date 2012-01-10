define(["require", "exports", "module"], function(require, exports, module) {
var CMYKAccessor = function(comp){
	this.__component = comp;
};

CMYKAccessor.prototype = {
	compare: function(a,b){
		var ca, cb;
		switch(this.__component){
			case 0:
				ca = a.cyan();
				cb = b.cyan();
				break;
			case 1:
				ca = a.magenta();
				cb = b.magenta();
				break;
			case 2:
				ca = a.yellow();
				cb = b.yellow();
				break;
			case 3:
			default:
				ca = a.black();
				cb = b.black();
		}
		return toxi._.numberCompare(ca,cb);
	},

	getComponentValueFor: function(col){
		var comp;
		switch(this.__component){
			case 0:
				comp = col.cyan();
				break;
			case 1:
				comp = col.magenta();
				break;
			case 2:
				comp = col.yellow();
				break;
			case 3:
			default:
				comp = col.black();
		}
		return comp;
	},

	setComponentValueFor: function(col, val){
		switch(this.__component){
			case 0:
				col.setCyan(val);
				break;
			case 1:
				col.setMagenta(val);
				break;
			case 2:
				col.setYellow(val);
				break;
			case 3:
			default:
				col.setBlack(val);
		}
	}
};

module.exports = CMYKAccessor;
});
