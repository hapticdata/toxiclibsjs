//load the config first
require(['./config'],function ( config ){
	require(['toxi/geom/Circle', 'toxi/geom/Sphere'], function (Circle, Sphere){
		var circle = new Circle( 0, 0, 100 );
		console.log( circle );

		var sphere = new Sphere( 100 );
		var mesh = sphere.toMesh({ resolution: 5 });
		console.log( mesh );
	});
});