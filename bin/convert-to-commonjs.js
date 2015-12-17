var nodefy = require('nodefy'),
    fs = require('fs'),
    path = require('path');

var target = 'commonjs';


exports.clean = function(callback){
    fs.rmdir(target, callback);
};

exports.convert = function(callback){
    nodefy.batchConvert('lib/toxi/**/*.js', target, function(err, results){
        if(err){
            callback(err);
            return;
        }

        var files = [
            'package.json',
            'README.md'
        ];

        var filesWritten = 0;

        files.forEach(function(file){
            var stream = fs.createReadStream(file).pipe(fs.createWriteStream(path.join(target,file)));
            stream.on('finish', function(){
                filesWritten++;
                if(filesWritten === files.length){
                    callback(null, results);
                }
            });
        });
    });
};


