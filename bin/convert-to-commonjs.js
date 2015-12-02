var nodefy = require('nodefy'),
    fs = require('fs'),
    path = require('path');

var target = 'commonjs';



nodefy.batchConvert('lib/toxi/**/*.js', target, function(err, results){
    if(err){
        console.log(err);
    }

    console.log(results.length + ' files converted');

    var files = ['package.json', 'README.md', 'bin/toxiclibsjs'];

    fs.mkdir(path.join(target, 'bin'), function(){
        files.forEach(function(file){
            fs.createReadStream(file).pipe(fs.createWriteStream(path.join(target,file)));
        });
    });
});


