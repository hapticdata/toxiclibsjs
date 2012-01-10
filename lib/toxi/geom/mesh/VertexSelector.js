define(["require", "exports", "module"], function(require, exports, module) {
/**
 * @class
 * @member toxi
 */
var VertexSelector = function(mesh){
	this.mesh = mesh;
	this.selection = [];
};

VertexSelector.prototype = {
	/**
     * Adds all vertices selected by the given selector to the current
     * selection. The other selector needs to be assigned to the same mesh
     * instance.
     * 
     * @param sel2 other selector
     * @return itself
     */

	addSelection: function(sel2){
		this.checkMeshIdentity(sel2.getMesh());
		this.selection.addAll(sel2.getSelection());
		return this;
	},
	
	/**
     * Utility function to check if the given mesh is the same instance as ours.
     * 
     * @param mesh2
     */
    checkMeshIdentity: function(mesh2) {
        if (mesh2 != this.mesh) {
            throw new Error("The given selector is not using the same mesh instance");
        }
    },
    
    clearSelection: function() {
        this.selection.clear();
        return this;
    },

	getMesh: function() {
        return this.mesh;
    },
    
    getSelection: function() {
        return this.selection;
    },
    /**
     * Creates a new selection of all vertices NOT currently selected.
     * 
     * @return itself
     */
    invertSelection: function() {
        var newSel = [];
        var vertices = mesh.getVertices();
        var l = vertices.length;
        for (var i=0;i<l;i++) {
			var v = vertices[i];
            if (!selection.contains(v)) {
                newSel.add(v);
            }
        }
        this.selection = newSel;
        return this;
    },

	/**
     * Selects vertices identical or closest to the ones given in the list of
     * points.
     * 
     * @param points
     * @return itself
     */
    selectSimilar: function(points) {
		var l = points.length;
        for (var i=0;i<l;i++) {
			var v = points[i];
            this.selection.add(this.mesh.getClosestVertexToPoint(v));
        }
        return this;
    },
    
     /**
     * Selects vertices using an implementation specific method. This is the
     * only method which needs to be implemented by any selector subclass.
     * 
     * @return itself
     */
   selectVertices: function(){
   return this;
   },
	
	setMesh: function(mesh) {
        this.mesh = mesh;
        this.clearSelection();
    },
    
    size: function() {
        return this.selection.size();
    },
	/**
     * Removes all vertices selected by the given selector from the current
     * selection. The other selector needs to be assigned to the same mesh
     * instance.
     * 
     * @param sel2
     *            other selector
     * @return itself
     */

	subtractSelection: function(sel2) {
        this.checkMeshIdentity(sel2.getMesh());
        this.selection.removeAll(sel2.getSelection());
        return this;
	}
};

module.exports = VertexSelector;

   
  
});
