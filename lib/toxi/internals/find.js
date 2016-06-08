define(function(){
	return function(array, iterator, context) {
		var found = false;
		var result;
		var i = 0;
		var hasContext = typeof context !== 'undefined';
	 	while (!found && i<array.length-1) {
			if ( iterator.call( (hasContext ? context : array[i] ), array[i] ) ) {
				found = true;
				result = array[i];
			}
		}
		return result;
	};
});
