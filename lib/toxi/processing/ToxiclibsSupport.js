define(["require", "exports", "module", "../geom/Matrix4x4","../geom/Vec3D","../geom/mesh/TriangleMesh"], function(require, exports, module) {

var Matrix4x4 = require('../geom/Matrix4x4'),
	Vec3D = require('../geom/Vec3D'),
	TriangleMesh = require('../geom/mesh/TriangleMesh');

var	ToxiclibsSupport = function(processing,optional_gfx){
	if(typeof Processing === 'undefined'){
		throw new Error("Processing.js has not been loaded");
	}
	this.sketch = processing;
	this.app = processing;
	if(optional_gfx !== undefined){
		this.gfx = processing;
	} else {
		this.gfx = this.app;
	}
	this._normalMap = new Matrix4x4().translateSelf(128,128,128).scaleSelf(127);
};



ToxiclibsSupport.prototype = {
	box: function(aabb,smooth){
		var mesh = aabb.toMesh();
		if(smooth === undefined){
			smooth = false;
		}
		if(smooth){
			mesh.computeVertexNormals();
		}
		this.mesh(mesh,smooth,0);
	},
	
	circle: function(p,radius){
		this.gfx.ellipse(p.x,p.y,radius,radius);
	},
	
	cone: function(){
		var cone = arguments[0],
			res = 6,
			thetaOffset = 0,
			topClosed = true,
			bottomClosed = true,
			smooth = false;
		if(arguments.length == 5){
			res = arguments[1];
			topClosed = arguments[2];
			bottomClosed = arguments[3];
			smooth = arguments[4];
		} else if(arguments.length == 3){
			res = arguments[1];
			smooth = arguments[2];
		}
		
		var mesh = cone.toMesh({
			mesh: new TriangleMesh(),
			steps: res,
			thetaOffset: thetaOffset,
			topClosed: topClosed,
			bottomClosed: bottomClosed
		});
		
		if(smooth){
			mesh.computeVertexNormals();
		}
		window.mesh = mesh;
		this.mesh(mesh,smooth,0);
	},
	
	cylinder: function(cyl,res,smooth){
		if(arguments.length == 1){
			this.mesh(cyl.toMesh(),false,0);
		} else {
			var mesh = cyl.toMesh(res,0);
			if(smooth === undefined){
				smooth = false;
			}
			if(smooth){
				mesh.computeVertexNormals();
			}
			this.mesh(mesh,smooth,0);
		}
	},
	
	/*
	Pjs currently doesn't provide access to PGraphics properties,
	such as ellipseMode. So I am allowing it as an optional propery
	*/
	ellipse: function(e,ellipseMode){
		var r = e.getRadii();
		if(ellipseMode === undefined){
			ellipseMode = this.app.CENTER;
		}
		if(ellipseMode === this.app.CENTER){
			this.gfx.ellipse(e.x,e.y,r.x*2,r.y*2);
		} else if(ellipseMode === this.app.RADIUS){
			this.gfx.ellipse(e.x,e.y,r.x*2,r.y*2);
		} else if(ellipseMode === this.app.CORNER || this.gfx.ellipseMode === this.app.CORNERS){
			this.gfx.ellipse(e.x-r.x,e.y-r.y,r.x*2,r.y*2);
		}
	},
	
	getGraphics: function(){
		return this.gfx;
	},
	
	line: function(){
		var a,
			b;
		if(arguments.length == 1){
			var line = arguments[0];
			a = line.a;
			b = line.b;
		} else {
			a = arguments[0],
			b = arguments[1];
		}
		if(a.z === undefined){
			this.gfx.line(a.x,a.y,b.x,b.y);
		} else {
			this.gfx.line(a.x,a.y,a.z,b.x,b.y,b.z);
		}
	},
	
	lineStrip2D: function(points){
		//var isFilled = this.fill; //TODO <-- verify how this works!
		//this.gfx.fill = false;
		this.processVertices2D(points,this.app.POLYGON,false);
		//this.gfx.fill = isFilled;
	},
	
	lineStrip3D: function(points){
		//var isFilled = this.gfx.fill;
		//this.gfx.fill = false;
		this.processVertices3D(points,this.app.POLYGON,false);
		//this.gfx.fill = isFilled;
	},
	
	mesh: function(mesh,smooth,normalLength){
		if(smooth === undefined){
			smooth = false;
		}
		if(normalLength === undefined){
			normalLength = 0;
		}
		
		this.gfx.beginShape(this.app.TRIANGLES);
		var i= 0,
			len = mesh.faces.length;
		if(smooth){
			for(i=0;i<len;i++){
				var f = mesh.faces[i];
				this.gfx.normal(f.a.normal.x,f.a.normal.y,f.a.normal.z);
				this.gfx.vertex(f.a.x,f.a.y,f.a.z);
				this.gfx.normal(f.b.normal.x,f.b.normal.y,f.b.normal.z);
				this.gfx.vertex(f.b.x,f.b.y,f.b.z);
				this.gfx.normal(f.c.normal.x,f.c.normal.y,f.c.normal.z);
				this.gfx.vertex(f.c.x,f.c.y,f.c.z);
			}
		} else {
			for(var i=0;i<len;i++){
				var f = mesh.faces[i];
				this.gfx.normal(f.normal.x,f.normal.y,f.normal.z);
				this.gfx.vertex(f.a.x,f.a.y,f.a.z);
				this.gfx.vertex(f.b.x,f.b.y,f.b.z);
				this.gfx.vertex(f.c.x,f.c.y,f.c.z);
			}
		}
		this.gfx.endShape();
		if(normalLength > 0){
			var strokeCol = 0;
			var isStroked = this.gfx.stroke;  //TODO <-- verify this works!
			if(isStroked){
				strokeCol = this.gfx.strokeColor;
			}
			len = mesh.vertices.length;
			if(smooth){
				for(i=0;i<len;i++){
					var v = mesh.vertices[i],
						w = v.add(v.normal.scale(normalLength));
						n = v.normal.scale(127);
					this.gfx.stroke(n.x + 128, n.y + 128, n.z + 128);
					this.gfx.line(v.x,v.y,v.z,w.x,w.y,w.z);
				}
			} else {
				var third = 1 / 3;
				len = mesh.faces.length;
				for(i=0;i<len;i++){
					var f = mesh.faces[i],
						c = f.a.add(f.b).addSelf(f.c).scaleSelf(third),
						d = c.add(f.normal.scale(normalLength)),
						n = f.normal.scale(127);
					this.gfx.stroke(n.x+128,n.y+128,n.z+128);
					this.gfx.line(c.x,c.y,c.z,d.x,d.y,d.z);
				}
			}
			if(isStroked){
				this.gfx.stroke(strokeCol);
			} else {
				this.gfx.noStroke();
			}
		}
	},
	
	meshNormalMapped: function(mesh,vertexNormals,normalLength){
		this.gfx.beginShape(this.app.TRIANGLES);
		var i =0,
			len = mesh.faces.length;
		if(vertexNormals){
			for(i=0;i<len;i++){
				var f = mesh.faces[i],
					n = this._normalMap.applyTo(f.a.normal);
				this.gfx.fill(n.x,n.y,n.z);
				this.gfx.normal(f.a.normal.x,f.a.normal.y,f.a.normal.z);
				this.gfx.vertex(f.a.x,f.a.y,f.a.z);
				n = this._normalMap.applyTo(f.b.normal);
				this.gfx.fill(n.x,n.y,n.z);
				this.gfx.normal(f.b.normal.x,f.b.normal.y,f.b.normal.z);
				this.gfx.vertex(f.b.x,f.b.y,f.b.z);
				n = this._normalMap.applyTo(f.c.nromal);
				this.gfx.fil(n.x,n.y,n.z);
				this.gfx.normal(f.c.normal.x,f.c.normal.y,f.c.normal.z);
				this.gfx.vertex(f.c.x,f.c.y,f.c.z);
			}
		} else {
			for(i = 0;i<len;i++){
				var f = mesh.faces[i];
				this.gfx.normal(f.normal.x,f.normal.y,f.normal.z);
				this.gfx.vertex(f.a.x,f.a.y,f.a.z);
				this.gfx.vertex(f.b.x,f.b.y,f.b.z);
				this.gfx.vertex(f.c.x,f.c.y,f.c.z);
			}
		}
		this.gfx.endShape();
		if(normalLength > 0){
			if(vertexNormals){
				len = mesh.vertices.length;
				for(i=0;i<len;i++){
					var v = mesh.vertices[i],
						w = v.add(v.normal.scale(normalLength)),
						n = v.normal.scale(127);
					this.gfx.stroke(n.x+128,n.y+128,n.z+128);
					this.gfx.line(v.x,v.y,v.z,w.x,w.y,w.z);
				}
			} else {
				len = mesh.faces.length;
				for(i=0;i<len;i++){
					var f = mesh.faces[i],
						c = f.getCentroid(),
						d = c.add(f.normal.scale(normalLength)),
						n = f.normal.scale(127);
					this.gfx.stroke(n.x+128,n.y+128,n.z+128);
					this.gfx.line(c.x,c.y,c.z,d.x,d.y,d.z);
				}
			}
		}
	},
	
	origin: function(){
		var o = undefined, len = undefined;
		if(arguments.length == 1){
			len = arguments[0];
			o = Vec3D.ZERO;
		} else {
			o = arguments[0];
			len = arguments[1];
		}
		
		this.gfx.stroke(255,0,0);
		this.gfx.line(o.x,o.y,o.z,o.x+len,o.y,o.z);
		this.gfx.stroke(0,255,0);
		this.gfx.line(o.x,o.y,o.z,o.x,o.y+len,o.z);
		this.gfx.stroke(0,0,255);
		this.gfx.line(o.x,o.y,o.z,o.x,o.y,o.z+len);
	},
	
	plane: function(plane,size){
		this.mesh(plane.toMesh(size),false,0);
	},
	
	point: function(p){
		if(p.z === undefined){
			this.gfx.point(p.x,p.y);
		} else {
			this.gfx.point(p.x,p.y,p.z);
		}
	},
	
	/**
	 * iterates and draws the provided 2D points
	 * @param {Array} or {Processing#Iterator} points to iterate
	 */
	points2D: function(points){
		this.processVertices2D(points,this.app.POINTS,false);
	},
	/**
	 * iterates and draws the provided 3D points
	 * @param {Array} or {Processing#Iterator} points to iterate
	 */
	points3D: function(points){
		this.processVertices3D(points,this.app.POINTS,false);
	},
	
	polygon2D: function(poly){
		this.processVertices2D(poly.vertices,this.app.POLYGON,false);
	},
	/**
	 * Processes the 2D vertices from a Processing.js Iterator object
	 * @params {Iterator} iterator
	 * @params {Number} shapeID
	 * @params {Boolean} closed
	 */
	processVertices2D: function(iterator, shapeID, closed){
		//if first param wasnt passed in as a pjs Iterator, make it one
		if(iterator.hasNext === undefined || iterator.next === undefined){
			iterator = new this.app.ObjectIterator( iterator );
		}
		this.gfx.beginShape(shapeID);
		for(var v  = void(0); iterator.hasNext() && ((v  = iterator.next()) || true);){
			this.gfx.vertex(v.x,v.y);
		}
		/*var i=0,
			len = points.length;
		for(i=0;i<len;i++){
			var v = points[i];
			this.gfx.vertex(v.x,v.y);
		}*/
		if(closed){
			this.gfx.endShape(this.app.CLOSE);
		} else {
			this.gfx.endShape();
		}
	},
	
	/**
	 * Processes the 3D vertices from a Processing.js Iterator object
	 * @params {Iterator} iterator
	 * @params {Number} shapeID
	 * @params {Boolean} closed
	 */
	processVertices3D: function(iterator,shapeID,closed){
		//if first param wasnt passed in as a pjs Iterator, make it one
		if(iterator.hasNext === undefined || iterator.next === undefined){
			iterator = new this.app.ObjectIterator( iterator );
		}
		this.gfx.beginShape(shapeID);
		for(var v  = void(0); iterator.hasNext() && ((v  = iterator.next()) || true);){
			this.gfx.vertex(v.x,v.y,v.z);
		}

		/*var i=0,
			len = points.length;
		for(i=0;i<len;i++){
			var v = points[i];
			this.gfx.vertex(v.x,v.y,v.z);
		}*/
		if(closed){
			this.gfx.endShape(this.app.CLOSE);
		} else {
			this.gfx.endShape();
		}
	},
	
	ray: function(ray, length){
		var e = ray.getPointAtDistance(length);
		if(ray.z === undefined){
			this.gfx.line(ray.x,ray.y,e.x,e.y);
		} else {
			this.gfx.line(ray.x,ray.y,ray.z,e.x,e.y,e.z);
		}
	},
	
	/*
	Pjs currently doesn't provide access to PGraphics properties,
	such as rectMode. So I am allowing it as an optional propery
	*/
	rect: function(r,rectMode){
		if(rectMode === undefined){
			rectMode = this.app.CORNER;
		}
		if(rectMode === this.app.CORNER){
			this.gfx.rect(r.x,r.y,r.width,r.height);
		} else if(rectMode === this.app.CORNERS){
			this.gfx.rect(r.x,r.y,r.x+r.width,r.y+r.height);
		} else if(rectMode === this.app.CENTER){
			this.gfx.rect(r.x+r.widt*0.5,r.y+r.height*0.5,r.width,r.height);
		} else if(rectMode === this.app.RADIUS){
			var rw = r.width * 0.5,
				rh = r.height *0.5;
			this.gfx.rect(r.x+rw,r.y+rh,rw,rh);
		}
	},
	
	setGraphics: function(gfx){
		this.gfx = gfx;
	},
	sphere: function(sphere, res,smooth){
		this.mesh(sphere.toMesh(res), smooth);
	},
	texturedMesh: function(mesh,tex,smooth){
		this.gfx.beginShape(this.app.TRIANGLES);
		this.gfx.texture(tex);
		var i =0,
			len = mesh.faces.length;
		if(smooth){
			for(i=0;i<len;i++){
				var f = mesh.faces[i];
				if(f.uvA !== undefined && f.uvB !== undefined && f.uvC !== undefined){
					this.gfx.normal(f.a.normal.x, f.a.normal.y, f.a.normal.z);
                	this.gfx.vertex(f.a.x, f.a.y, f.a.z, f.uvA.x, f.uvA.y);
                	this.gfx.normal(f.b.normal.x, f.b.normal.y, f.b.normal.z);
                	this.gfx.vertex(f.b.x, f.b.y, f.b.z, f.uvB.x, f.uvB.y);
                	this.gfx.normal(f.c.normal.x, f.c.normal.y, f.c.normal.z);
                	this.gfx.vertex(f.c.x, f.c.y, f.c.z, f.uvC.x, f.uvC.y);
            	} else {
                	this.gfx.vertex(f.a.x, f.a.y, f.a.z);
                	this.gfx.vertex(f.b.x, f.b.y, f.b.z);
                	this.gfx.vertex(f.c.x, f.c.y, f.c.z);
				}
			}
		} else {
			for(i=0;i<len;i++){
				var f= mesh.faces[i];
				this.gfx.normal(f.normal.x,f.normal.y,f.normal.z);
				if(f.uvA !== undefined && f.uvB !== undefined && f.uvC !== undefined){
					this.gfx.vertex(f.a.x, f.a.y, f.a.z, f.uvA.x, f.uvA.y);
                	this.gfx.vertex(f.b.x, f.b.y, f.b.z, f.uvB.x, f.uvB.y);
                	this.gfx.vertex(f.c.x, f.c.y, f.c.z, f.uvC.x, f.uvC.y);
            	} else {
                	this.gfx.vertex(f.a.x, f.a.y, f.a.z);
                	this.gfx.vertex(f.b.x, f.b.y, f.b.z);
                	this.gfx.vertex(f.c.x, f.c.y, f.c.z);
				}
			}
		}
		this.gfx.endShape();
	},
	
	//works for Triangle3D or Triangle2D
	triangle: function(tri,isFullShape){

		var isTriangle = function(){
			if(tri.a !== undefined && tri.b !== undefined && tri.c !== undefined){
				return (tri.a.x !== undefined);
			}
			return false;
		},
		isTriangle3D = function(){
			if(isTriangle()){
				return (tri.a.z !== undefined);
			}
			return false;
		};

		if(isFullShape || isFullShape === undefined){
			this.gfx.beginShape(this.app.TRIANGLES);
		}
		if(isTriangle3D()){
			var n = tri.computeNormal();
			this.gfx.normal(n.x,n.y,n.z);
			this.gfx.vertex(tri.a.x, tri.a.y, tri.a.z);
			this.gfx.vertex(tri.b.x, tri.b.y, tri.b.z);
			this.gfx.vertex(tri.c.x, tri.c.y, tri.c.z);
		} else { //should be Triangle2D
			this.gfx.vertex(tri.a.x,tri.a.y);
			this.gfx.vertex(tri.b.x,tri.b.y);
			this.gfx.vertex(tri.c.x,tri.c.y);
		}
    	if(isFullShape || isFullShape === undefined){
    		this.gfx.endShape();
    	}
	},
	
	vertex: function(v){
		if(v.z === undefined){
			this.gfx.vertex(v.x,v.y);
		} else {
			this.gfx.vertex(v.x,v.y,v.z);
		}
	}
};

module.exports = ToxiclibsSupport;
});
