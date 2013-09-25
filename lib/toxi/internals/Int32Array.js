define(function(){
    return (typeof Int32Array !== 'undefined') ? Int32Array : Array;
});
