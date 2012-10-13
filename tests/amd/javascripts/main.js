//load the config first
require(['./config'],function ( config ){
	require(['toxi/internals','toxi/geom/Vec3D', 'toxi/geom/XAxisCylinder'], function( internals, Vec3D, XAxisCylinder ){
		var cylMesh = new XAxisCylinder( new Vec3D(), 100, 125 ).toMesh({ steps: 5 });

		console.log( cylMesh.getBoundingBox());
		console.log( cylMesh.getBoundingSphere() );
	});
	/*require(['toxi/geom/Circle', 'toxi/geom/Sphere'], function (Circle, Sphere){
		var circle = new Circle( 0, 0, 100 );
		console.log( circle );

		var sphere = new Sphere( 100 );
		var mesh = sphere.toMesh({ resolution: 5 });
		console.log( mesh );
	});*/
});