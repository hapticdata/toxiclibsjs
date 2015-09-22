var nodefy = require('nodefy'),
    fs = require('fs'),
    path = require('path');




nodefy.batchConvert('lib/toxi/**/*.js', 'cjs', function(err, results){
    if(err){
        console.log(err);
    }

    console.log(results.length + ' files converted');

    var cjsPath = path.resolve('cjs');
    fs.createReadStream('package.json').pipe(fs.createWriteStream(path.join('cjs','package.json')));
});


