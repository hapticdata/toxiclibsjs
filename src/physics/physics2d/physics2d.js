toxi.physics2d = toxi.physics2d || {};

toxi.physics2d.removeItemFrom = function(item,array){
	var index = array.indexOf(item);
	if(index > -1){
		return array.splice(index,1);
	}
	console.log("undefined");
	return undefined;
}
