#Differences from the original [Toxiclibs](http://toxiclibs.org)

##Arrays / Collections

The Java version frequently uses [Collections](http://docs.oracle.com/javase/tutorial/collections/), [Iterators](http://docs.oracle.com/javase/1.4.2/docs/api/java/util/Iterator.html), and [java-specific for-loops](http://stackoverflow.com/questions/8681593/does-javascript-have-an-enhanced-for-loop-syntax-similar-to-javas)[[2]](http://blogs.oracle.com/sundararajan/entry/java_javascript_and_jython). In toxiclibs.js you will see a standard JavaScript usage of arrays. Below is an example of accessing the faces from a TriangleMesh:

	var len = mesh.faces.length,
		i = 0;
	for(i = 0; i < len; i++){
		var face = mesh.faces[i];
	}

This section will occassionally be expanded on. If you have a suggestion, or have a question on how something works, feel free to [leave an issue](https://github.com/hapticdata/toxiclibsjs/issues) and I am quick to respond.