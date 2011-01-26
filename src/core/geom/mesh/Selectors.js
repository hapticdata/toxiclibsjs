/**
 *  includes all classes extending VertexSelector
 * (BoxSelector, DefaultSelector, PlaneSelector)
 */

function BoxSelector(mesh,box) {
    this.parent.init.call(this,mesh);
    this.box = box;
}
    
BoxSelector.prototype.selectVertices = function() {
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

BoxSelector.prototype = new VertexSelector();
BoxSelector.constructor = BoxSelector;
BoxSelector.prototype.parent = VertexSelector.prototype;



function DefaultSelector(mesh){
	this.parent.init.call(this,mesh);
}
		
DefaultSelector.prototype.selectVertices = function(){
	this.clearSelection();
	this.selection.addAll(this.mesh.getVertices());
	return this;
}

DefaultSelector.prototype = new VertexSelector();
DefaultSelector.constructor = DefaultSelector;
DefaultSelector.prototype.parent = VertexSelector.prototype;




function PlaneSelector(mesh,plane,classifier, tolerance) {
    this.parent.init.call(this,mesh);
    this.plane = plane;
    this.classifier = classifier;
    this.tolerances = (tolerance === undefined)? 0.0001f : tolerance;

    
}

PlaneSelector.prototype.selectVertices = function() {
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

PlaneSelector.prototype = new VertexSelector();
PlaneSelector.constructor = PlaneSelector;
PlaneSelector.prototype.parent = VertexSelector.prototype;