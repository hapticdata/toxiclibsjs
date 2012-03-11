define(['toxi/geom/Sphere'], function(Sphere){

  console.log("using require.js");
  console.log(new Sphere(200).toMesh(undefined,20));


/*require(["toxi/geom"],function(Vec3D,AABB){
    for(var i=0;i<arguments.length;i++){
        console.log(arguments[i]);
    }
});*/
});
