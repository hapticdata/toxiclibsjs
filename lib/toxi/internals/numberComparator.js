define(function(){
    return function(f1,f2){
        if(f1 == f2) return 0;
        if(f1 < f2) return -1;
        if(f1 > f2) return 1;
    };
});
