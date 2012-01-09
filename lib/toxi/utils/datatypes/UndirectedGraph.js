define(["require", "exports", "module", "./ArraySet"], function(require, exports, module) {

var ArraySet = require('./ArraySet');


//wrap connections in this before passing them out
//this way the rest of the lib can treat it like a Java Collection
/*var __NodeCollection = function(nodes){
	var self = this;
	for(var i=0,len = nodes.length;i<len;i++){
		this[i] = nodes[i];
	}
};
__NodeCollection.prototype = {
	contains: function(el){
		return this[el] !== undefined;
	},
	size: function(){
		var i = 0;
		for(var prop in this){
			if(this.hasOwnProperty(prop)){
				i++;
			}
		}
		return i;
	}
};*/


/**
 * @exports UndirectedGraph as toxi.UndirectedGraph
 */
var UndirectedGraph = function(){
	this._nodeLinks = {};
	this._nodeIDs = [];
};


UndirectedGraph.prototype = {
	add: function(node){
		if(this._nodeLinks[node] !== undefined){
			return;
		}
		this._nodeLinks[node] = new ArraySet();
		this._nodeIDs.push(node);
	},
	connect: function(nodeA,nodeB){
		if(this._nodeLinks[nodeA] === undefined){
			throw new Error("nodeA has not been added");
		}
		if(this._nodeLinks[nodeB] === undefined){
			throw new Error("nodeB has not been added");
		}
		this._nodeLinks[nodeA].push(nodeB);
		this._nodeLinks[nodeB].push(nodeA);
	},
	disconnect: function(nodeA,nodeB){
		if(this._nodeLinks[nodeA] === undefined){
			throw new Error("nodeA has not been added");
		}
		if(this._nodeLinks[nodeB] === undefined){
			throw new Error("nodeB has not been added");
		}
		this._nodeLinks[nodeA].splice(this._nodeLinks[nodeA].indexOf(nodeB),1);
		this._nodeLinks[nodeB].splice(this._nodeLinks[nodeB].indexOf(nodeA),1);
	},
	getConnectedNodesFor: function(node){
		if(this._nodeLinks[node] === undefined){
			throw new Error("node has not been added");
		}
		return this._nodeLinks[node];
	},
	getNodes: function(){
		return this._nodeIDs;
	},
	remove: function(node){
		var connections = this._nodeLinks[node];
		if(connections === undefined){
			return;
		}

		for(var i = 0,len = connections.length;i<len;i++){
			var neighbor = connections[i];
			var	nodeI = neighbor.indexOf(node);
			neighbor.splice(nodeI,1);
		}
		delete this._nodeLinks[node];
		var i = this._nodeIDs.indexOf(node);
		this._nodeIDs.splice(node,1);
	}
};

module.exports = UndirectedGraph;
});
