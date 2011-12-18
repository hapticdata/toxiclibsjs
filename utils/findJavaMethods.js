
var fs = require('fs'),
	util = require('util');



	fs.readFile(
		'/Users/kphillips/Sites/libs/toxiclibs/src.core/toxi/geom/Matrix4x4.java',
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
			console.log("length: "+fnDefs.length);
		}
	);


	//(?:(?:public)|(?:private)|(?:static)|(?:protected)\s+)*