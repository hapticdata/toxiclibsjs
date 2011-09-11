/**
 *  includes all classes extending VertexSelector
 * (BoxSelector, DefaultSelector, PlaneSelector)
 */

toxi.BoxSelector = function(mesh,box) {
    toxi.VertexSelector.apply(this,[mesh]);
    this.box = box;
};
toxi.extend(toxi.BoxSelector,toxi.VertexSelector);

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
};

toxi.DefaultSelector = function(mesh){
	toxi.VertexSelector.apply(this,[mesh]);
};
toxi.extend(toxi.DefaultSelector,toxi.VertexSelector);	
toxi.DefaultSelector.prototype.selectVertices = function(){
	this.clearSelection();
	this.selection.addAll(this.mesh.getVertices());
	return this;
};





toxi.PlaneSelector = function(mesh,plane,classifier, tolerance) {
    toxi.VertexSelector.apply(this,[mesh]);
    this.plane = plane;
    this.classifier = classifier;
    this.tolerances = (tolerance === undefined)? 0.0001 : tolerance;
};
toxi.extend(toxi.PlaneSelector,toxi.VertexSelector);
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
};
