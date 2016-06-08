define(function(){
	return function(array, iterator, context) {
		var found = false;
		var result;
		var i = 0;
		while (!result && i<array.length) {
			if ( iterator.call( (context) ? context : array[i] ), array[i] ) {
				found = true;
				result = array[i];
			}
			++i;
		}
		return result;
	};
});
