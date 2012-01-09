define(["require", "exports", "module", "../internals","../math/mathUtils","./TColor","./HSVDistanceProxy","./RGBDistanceProxy","./ProximityComparator","./ColorTheoryRegistry","./AccessCriteria"], function(require, exports, module) {

var internals = require('../internals'),
	mathUtils = require('../math/mathUtils'),
	TColor = require('./TColor'),
	HSVDistanceProxy = require('./HSVDistanceProxy'),
	RGBDistanceProxy = require('./RGBDistanceProxy'),
	ProximityComparator = require('./ProximityComparator'),
	ColorTheoryRegistry = require('./ColorTheoryRegistry'),
	AccessCriteria = require('./AccessCriteria');

/**
 * A container class of concrete colors. ColorLists can be built manually and
 * are also created when working with {@link ColorRange}s. The class has various
 * methods to manipulate all colors in the list in parallel, as well as sort
 * them by various criteria.
 * 
 * @see ColorRange
 * @see AccessCriteria
 */

//private helpers
var	_sort = function(){
 	
};
var	_eachColor = function(cl,fn){
		internals.each(cl._colors,fn);
	};

/**
 @memberOf toxi.color
 @class Creates a ColorList by wrapping the given ArrayList of colors. No copies
 of the given colors are created (shallow copy only). 
 @param {TColor[]} colors
*/
var ColorList = function(colors){
	if(arguments.length > 1){
		return ColorList.apply(this,arguments);
	}
	this._colors = [];
	if(colors !== undefined){
		this.addAll(colors);
	}
};

ColorList.protoype = {
	/**
	* Adds a copy of the given color to the list
	* 
	* @param {TColor} c
	* @return itself
	*/
	add: function(c){
		this._colors.push(c.copy());
		return this;
	},
	/**
	* Adds all entries of the TColor collection to the list (shallow copy only,
	* manipulating the new list will modify the original colors).
	* 
	* @param {Array} collection
	* @return itself
	*/
	addAll:	function(collection){
		internals.each(collection,function(color){
			this._colors.push(color);
		});
		return this;
	},
	/**
	* Adjusts the brightness component of all list colors by the given amount.
	* 
	* @param step adjustment value
	* @return itself
	*/
	adjustBrightness: function(step){
		internals.each(this._colors,function(c){
			c.lighten(step);
		});
		return this;
	},
	/**
	 * Adjusts the saturation component of all list colors by the given amount.
	 * 
	 * @param step
	 *            adjustment value
	 * @return itself
	 */
	adjustSaturation: function(step){
		internals.each(this._colors,function(c){
			c.saturate(step);
		});
		return this;
	},
	/**
	* Sorts the list based on two criteria to create clusters/segments within
	* the list.
	* 
	* @param clusterCriteria main sort criteria
	* @param subClusterCriteria secondary sort criteria
	* @param numClusters number of clusters
	* @param isReversed true, if reversed sort
	* @return itself
	*/
	clusterSort: function(clusterCriteria, subClusterCriteria, numClusters, isReversed){
		var sorted = this._colors.slice(0),
			clusters = [],
			d = 1,
			i = 0,
			num = sorted.length,
			slice;

			sorted = _sort(sorted, clusterCriteria).reverse();
		for(var j=0;j<num;j++){
			var c = sorted[j];
			if(c.getComponentValue(clusterCriteria) < d){
				slice = sorted.slice(i, j);
				slice = _sort(slice, subClusterCriteria);
				clusters.push.apply(clusters,slice);
				d -= 1.0 / numClusters;
				i = j;
			}
		}
		slice = [];
		slice.push.apply(slice,sorted.slice(i,sorted.length));
		slice = _sort(slice, subClusterCriteria);
		clusters.push.apply(clusters,slice);
		if(isReversed){
			clusters.reverse();
		}
		this._colors = clusters;
		return this;
	},
	/**
	* Switches all list colors to their complementary color.
	* 
	* @return itself
	*/
	complement: function(){
		_eachColor(function(c){
			c.complement();
		});
		return this;
	},
	/**
	* Checks if the given color is part of the list. Check is done by value,
	* not instance.
	* 
	* @param color
	* @return true, if the color is present.
	*/
	contains: function(color){
		_eachColor(function(c){
			if(c.equals(color)){
				return true;
			}
		});
		return false;
	},
	/**
	* Returns the color at the given index. This function follows Python
	* convention, in that if the index is negative, it is considered relative
	* to the list end. Therefore the color at index -1 is the last color in the
	* list.
	* 
	* @param i
	*            index
	* @return color
	*/
	get: function(i){
		if(i < 0){
			i += this._colors.length;
		}
		return this._colors[i];
	},
	/**
	* Calculates and returns the average color of the list.
	* 
	* @return average color or null, if there're no entries yet.
	*/
	getAverage: function(){
		var r = 0,
			g = 0,
			b = 0,
			a = 0;

		_eachColor(function(c){
			r += c.rgb[0];
			g += c.rgb[1];
			b += c.rgb[2];
			a += c.alpha();
		});

		var num = this._colors.length;
		if(num > 0){
			return TColor.newRGBA(r / num, g / num, b / num, a / num);
		} 
		return undefined;
	},
	/**
	* Creates a new ColorList by blending all colors in the list with each
	* other (successive indices only)
	* 
	* @param amount
	*            blend amount
	* @return new color list
	*/
	getBlended: function(amount){
		var clrs = [],
			len = this._colors.length;
		for(var i=0; i< len; i++){
			var index = i > 0 ? i -1 : clrs.length - 1,
				c = this._colors[index];
			clrs.push(this._colors[i].getBlended(c,amount));
		}
		return new ColorList(clrs);
	},
	/**
	* Finds and returns the darkest color of the list.
	* 
	* @return darkest color or null if there're no entries yet.
	*/
	getDarkest: function(){
		var darkest,
			minBrightness = Number.MAX_VALUE;
		_each(function(c){
			var luma = c.luminanc();
			if(luma < minBrightness){
				darkest = c;
				minBrightness = luma;
			}
		});
		return darkest;
	},
	/**
	* Finds and returns the lightest (luminance) color of the list.
	* 
	* @return lightest color or null, if there're no entries yet.
	*/
	getLightest: function(){
		var lightest,
			maxBrightness = Number.MIN_VALUE;
		_each(function(c){
			var luma = c.luminance();
			if(luma > maxBrightness){
				lightest = c;
				maxBrightness = luma;
			}
		});
		return lightest;
	},

	getRandom: function(){
		var index = Math.floor(mathUtils.random(this._colors.length));
		return this._colors[index];
	},

	getReverse: function(){
		return new ColorList(this._colors).reverse();
	},

	invert: function(){
		_each(function(c){
			c.invert();
		});
		return this;
	},

	iterator: function(){
		return new internals.Iterator(this._colors);
	},

	reverse: function(){
		this._colors.reverse();
		return this;
	},

	rotateRYB: function(theta, isRadians){
		var angle;
		if(theta !== Math.floor(theta) || isRadians){
			angle = mathUtils.degrees(theta);
		} else {
			angle = theta;
		}
		_each(function(c){
			c.rotateRYB(angle);
		});
		return this;
	},

	size: function(){
		return this._colors.length;
	},

	sort: function(){
		return this.sortByCriteria(AccessCriteria.HUE, false);
	},
	/**
	* Sorts the list using the given comparator.
	* 
	* @param comp
	*            comparator
	* @param isReversed
	*            true, if reversed sort
	* @return itself
	*/
	sortByComparator: function(comp, isReversed){
		this._colors = _sort(this._colors, comp);
		if(isReversed){
			this._colors.reverse();
		}
		return this;
	},
	/**
	* Sorts the list using the given {@link AccessCriteria}.
	* 
	* @param criteria
	*            sort criteria
	* @param isReversed
	*            true, if reversed sort
	* @return itself
	*/
	sortByCriteria: function(criteria, isReversed){
		return this._sortByComparator(criteria, isReversed);
	},
	/**
	* Sorts the list by relative distance to each predecessor, starting with
	* the darkest color in the list.
	* 
	* @param isReversed
	*            true, if list is to be sorted in reverse.
	* @return itself
	*/

	//TODO requires HSVDistanceProxy
	sortByDistance: function(proxy, isReversed){
		if(arguemnts.length == 1){
			isReversed = arguments[0];
			proxy = new HSVDistanceProxy();
		}
		
		if(this._colors.length == 0){
			return this;
		}

		// Remove the darkest color from the stack,
    	// put it in the sorted list as starting element.
		var root = this.getDarkest(),
			stack = this._colors.slice(0),
			sorted = [];

		stack.splice(stack.indexOf(root),1);
		sorted.push(root);

		// Now find the color in the stack closest to that color.
		// Take this color from the stack and add it to the sorted list.
		// Now find the color closest to that color, etc.
		var sortedCount = 0;
		while(stack.length > 1){
			var closest = stack[0],
				lastSorted = sorted[sortedCount],
				distance = proxy.distanceBetween(closest, lastSorted);
			
			for(var i = stack.length - 1; i >= 0; i--){
				var c = stack[i],
					d = proxy.distanceBetween(c, lastSorted);
				if(d < distance){
					closest = c;
					distance = d;
				}
			}
			stack.splice(stack.indexOf(closest),1);
			sorted.push(closest);
			sortedCount++;
		}
		sorted.push(stack[0]);
		if(isReversed){
			sorted.reverse();
		}
		this._colors = sorted;
		return this;
	},
	/**
	* Sorts the list by proximity to the given target color (using RGB distance
	* metrics).
	* 
	* @see #sortByProximityTo(ReadonlyTColor, DistanceProxy, boolean)
	* @param target
	*            color
	* @param isReversed
	*            true, if reverse sorted
	* @return sorted list
	*/
	sortByProximityTo: function(target, proxy, isReversed){
		if(arguments.length == 2){
			target = arguments[0];
			proxy = new RGBDistanceProxy();
			isReversed = arguments[1];
		}
		return this.sortByComparator(new ProximityComparator(target,proxy), isReversed);
	},

	toARGBArray: function(){
		var array = [],
			i = 0;
		_each(function(c){
			array.push(c.toARGB());
		});
		return array;
	}
};

/**
 * Factory method. Creates a new ColorList of colors randomly sampled from
 * the given ARGB image array. If the number of samples equals or exceeds
 * the number of pixels in the source image and no unique colors are
 * required, the function will simply return the same as
 * {@link #ColorList(int[])}.
 * 
 * @param pixels
 *            int array of ARGB pixels
 * @param num
 *            number of colors samples (clipped automatically to number of
 *            pixels in the image)
 * @param uniqueOnly
 *            flag if only unique samples are to be taken (doesn't guarantee
 *            unique colors though)
 * @param maxIterations (optional)
 *            max number of attempts to find a unique color. If no more
 *            unique colors can be found the search is terminated.
 * @return new color list of samples
 */
 ColorList.createFromARGBArray = function(pixels, num, uniqueOnly, maxIterations){
 	maxIterations = maxIterations || 100;
 	num = mathUtils.min(num, pixels.length);
 	if(!uniqueOnly && num == pixels.length){
 		return new ColorList(pixels);
 	}

 	var colors = [],
 		temp = TColor.BLACK.copy(),
 		i = 0,
 		isUnique = true,
 		numTries = 0,
 		idx;
 	for(i=0;i<num;i++){
 		if(uniqueOnly){
 			isUnique = true;
 			numTries = 0;
 			do {
 				idx = mathUtils.random(pixels.length);
 				temp.setARGB(pixels[idx]);
 				isUnique = !(colors.indexOf(temp) >= 0);
 			} while (!isUnique && ++numTries < maxIterations);
 			if(numTries < maxIterations) {
 				colors.push(temp.copy());
 			} else {
 				break;
 			}
 		} else {
 			idx = mathUtils.random(pixels.length);
 			colors.push(TColor.newARGB(pixels[idx]));
 		}
 	}
 	return new ColorList(colors);
 };

/**
* Factory method. Creates a new ColorList based on the given
* {@link ColorTheoryStrategy} instance and the given source color. The
* number of colors returned will vary with the strategy chosen.
* 
* @param strategy
* @param c
* @return new list
*/
ColorList.createUsingStrategy = function(strategy, c){
	if(typeof strategy == 'string'){
		strategy = ColorTheoryRegistry.getStrategyForName(strategy);
	}
	var list;
	if(strategy !== undefined){
		list = strategy.createListFromColor(c);
	}
	return list;
};

module.exports = ColorList;
});
