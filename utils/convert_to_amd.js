var cp = require('child_process'),
	fs = require('fs'),
	libDir = '../lib',
	destDir = '../build/requirejs',
	revisionsFile = './REVISION',
	revision = parseInt(fs.readFileSync(revisionsFile),10),
	child;


var updateRevision = function(){
	revision+=1;
	revision = revision.toString();
	fs.writeFile(revisionsFile,revision,function(err){
		if(err)throw err;
		console.log("Update to revision #"+revision);
	})
	fs.writeFile(destDir+'/REVISION',revision,function(err){
		if(err)throw err;
	});
};

child = cp.exec('node r.js/dist/r-1.0.0.js -convert '+libDir+' '+destDir,
	function(error, stdout, stderr){
		console.log('-----------------------------\n'+
					'toxiclibs.js converted to AMD\n' +
					'-----------------------------');
		if(stderr !== null && stderr.length > 0){
			console.log("STDERROR: "+stderr);
		}
		//updateRevision();
		if (error !== null) {	
      		console.log('exec error: ' + error);
    	}
	}
);