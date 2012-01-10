
var fs = require('fs'),
	util = require('util'),
	pkg = "geom",
	name = "Matrix4x4";


if(process.argv.length > 2){
	pkg = process.argv[2];
	name = process.argv[3];
	console.log("pkg: "+pkg + ", name: "+name);
}

var file = 	file = '/Users/kphillips/Sites/libs/toxiclibs/src.core/toxi/'+pkg+'/'+name+'.java';

	fs.readFile(
		file,
		'utf8',
		function(err,data){
			var classOpener = 'public class';
			var insideClass = data.slice(data.indexOf(classOpener)+classOpener.length);
			var everyPublicFunction = insideClass.split("public ");
			var fnDefs = [];
			
			everyPublicFunction.forEach(function(fn,i){
				//make sure its a method, not a variable
				if(fn.indexOf('(') > 0 && fn.indexOf(')') > 0){
					var fnDef = {};
					fn = fn.slice(0,fn.indexOf('{')-1);
					var indexOfFirstSpace = fn.indexOf(' ');
					fnDef.returns = fn.slice(0,indexOfFirstSpace);
					//if(fnDef.returns.length < 1)return;
					fn = fn.slice(indexOfFirstSpace+1);
					var indexOfOpeningParam = fn.indexOf('(');
					fnDef.name = fn.slice(0,indexOfOpeningParam);
					fn = fn.slice(indexOfOpeningParam+1);
					fn = fn.slice(0,fn.indexOf(')'));
					fnDef.parameters = fn;//fn.slice(fn.indexOf('('),fn.indexOf(')'));
					fnDefs.push(fnDef);
				}
			});
			console.log(fnDefs);

			fs.writeFile(name+'.txt',toMarkdown(fnDefs), function(err){
				console.log(name+'.txt written');
			});

			console.log("length: "+fnDefs.length);
		}
	);


	var toMarkdown = function(defs){
		var md = '';
		defs.forEach(function(d,key){
			md += '**'+d.name+'(** *'+d.parameters+'* **)**\nreturns *'+d.returns+'*\n\n';
		});
		return md;
	};

	//(?:(?:public)|(?:private)|(?:static)|(?:protected)\s+)*