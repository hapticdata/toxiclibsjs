var nodefy = require('nodefy'),
    fs = require('fs'),
    path = require('path');

var target = 'commonjs';



nodefy.batchConvert('lib/toxi/**/*.js', target, function(err, results){
    if(err){
        console.log(err);
    }

    console.log(results.length + ' files converted');

    fs.createReadStream('package.json').pipe(fs.createWriteStream(path.join(target,'package.json')));
});


