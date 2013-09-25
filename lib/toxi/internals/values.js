define(['./has'],function(has){
    return function(obj) {
        var values = [];
        for (var key in obj) if (has.property(obj, key)) values.push(obj[key]);
        return values;
    };
});
