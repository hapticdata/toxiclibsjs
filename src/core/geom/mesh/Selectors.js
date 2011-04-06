/**
 *  includes all classes extending VertexSelector
 * (BoxSelector, DefaultSelector, PlaneSelector)
 */

toxi.BoxSelector = function(mesh,box) {
    this.parent.init.call(this,mesh);
    this.box = box;
}
    
toxi.BoxSelector.prototype.selectVertices = function() {
    this.clearSelection();
    var verts = this.mesh.getVertices();
    var l = verts.length;
    for (var i=0;i<l;i++) {
    	var v = verts[i];
        if (this.box.containsPoint(v)) {
            this.selection.add(v);
        }
    }
    return this;
}

toxi.BoxSelector.prototype = new toxi.VertexSelector();
toxi.BoxSelector.constructor = toxi.BoxSelector;
toxi.BoxSelector.prototype.parent = toxi.VertexSelector.prototype;



toxi.DefaultSelector = function(mesh){
	this.parent.init.call(this,mesh);
}
		
toxi.DefaultSelector.prototype.selectVertices = function(){
	this.clearSelection();
	this.selection.addAll(this.mesh.getVertices());
	return this;
}

toxi.DefaultSelector.prototype = new toxi.VertexSelector();
toxi.DefaultSelector.constructor = toxi.DefaultSelector;
toxi.DefaultSelector.prototype.parent = toxi.VertexSelector.prototype;




toxi.PlaneSelector = function(mesh,plane,classifier, tolerance) {
    this.parent.init.call(this,mesh);
    this.plane = plane;
    this.classifier = classifier;
    this.tolerances = (tolerance === undefined)? 0.0001 : tolerance;
}

toxi.PlaneSelector.prototype.selectVertices = function() {
    this.clearSelection();
    var verts = this.mesh.getVertices();
    var l = verts.length;
    for (var i=0;i<l;i++) {
    	var v = verts[i];
        if (this.plane.classifyPoint(v, this.tolerance) == this.classifier) {
            this.selection.add(v);
        }
    }
    return this;
}

toxi.PlaneSelector.prototype = new toxi.VertexSelector();
toxi.PlaneSelector.constructor = toxi.PlaneSelector;
toxi.PlaneSelector.prototype.parent = toxi.VertexSelector.prototype;