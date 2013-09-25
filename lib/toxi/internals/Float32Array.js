define(function(){
   return (typeof Float32Array !== 'undefined') ? Float32Array : Array;
});
