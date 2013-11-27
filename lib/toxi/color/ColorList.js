define(function(require, exports, module) {

var is = require('../internals/is'),
    each = require('../internals/each'),
    Iterator = require('../internals/Iterator'),
	mathUtils = require('../math/mathUtils'),
	TColor = require('./TColor'),
	HSVDistanceProxy = require('./HSVDistanceProxy'),
	RGBDistanceProxy = require('./RGBDistanceProxy'),
	ProximityComparator = require('./ProximityComparator'),
	AccessCriteria = require('./accessCriteria');

/**
 * A container class of concrete colors. ColorLists can be built manually and
 * are also created when working with {@link ColorRange}s. The class has various
 * methods to manipulate all colors in the list in parallel, as well as sort
 * them by various criteria.
 * @see ColorRange
 * @see AccessCriteria
 */


/**
 @memberOf toxi.color
 @class Creates a ColorList by wrapping the given ArrayList of colors. No copies
 of the given colors are created (shallow copy only).
 @param {TColor[]} colors
*/
var ColorList = function(colors){
	if(arguments.length > 1){
		return ColorList.call(this,arguments);
	}
	this.colors = [];
    var i = 0;
    if( is.Array(colors) && colors.length ){
        if( typeof colors[0] === 'number' ){
            //argb integers
            for( i=0, l = colors.length; i<l; i++){
                this.colors.push(TColor.newARGB(colors[i]));
            }
        } else {
            //an array of tcolors
            this.addAll(colors);
        }
    } else if( is.ColorList(colors) ){
        for( i=0, l=colors.size(); i<l; i++){
            this.add(colors.get(i));
        }
    } else if( is.TColor(colors) ){
        //tcolor
        this.add(colors);
    }
};

ColorList.prototype = {
	constructor: ColorList,
	/**
	* Adds a copy of the given color to the list
	* @param {TColor} c
	* @return itself
	*/
	add: function(c){
		this.colors.push(c.copy());
		return this;
	},
	/**
	* Adds all entries of the TColor collection to the list (shallow copy only,
	* manipulating the new list will modify the original colors).
	* @param {Array} collection
	* @return itself
	*/
	addAll:	function(collection){
		var self = this;
        if( !is.Array(collection) ){
            this.colors.push(collection);
        } else {
            each(collection,function(color){
                self.colors.push(color);
            });
        }
		return this;
	},
	/**
	* Adjusts the brightness component of all list colors by the given amount.
	* @param step adjustment value
	* @return itself
	*/
	adjustBrightness: function(step){
		each(this.colors,function(c){
			c.lighten(step);
		});
		return this;
	},
	/**
	 * Adjusts the saturation component of all list colors by the given amount.
		 * @param step
	 *            adjustment value
	 * @return itself
	 */
	adjustSaturation: function(step){
		each(this.colors,function(c){
			c.saturate(step);
		});
		return this;
	},
	/**
	* Sorts the list based on two criteria to create clusters/segments within
	* the list.
	* @param clusterCriteria main sort criteria
	* @param subClusterCriteria secondary sort criteria
	* @param numClusters number of clusters
	* @param isReversed true, if reversed sort
	* @return itself
	*/
	clusterSort: function(clusterCriteria, subClusterCriteria, numClusters, isReversed){
		var sorted = this.colors.slice(0),
			clusters = [],
			d = 1,
			i = 0,
			num = sorted.length,
			slice;

		sorted.sort( clusterCriteria.compare ).reverse();
		for(var j=0;j<num;j++){
			var c = sorted[j];
			if(c.getComponentValue(clusterCriteria) < d){
				slice = sorted.slice(i, j);
				slice.sort( subClusterCriteria.compare );
				clusters.push.apply(clusters,slice);
				d -= 1.0 / numClusters;
				i = j;
			}
		}
		slice = [];
		Array.prototype.push.apply(slice,sorted.slice(i,sorted.length));
		slice.sort( subClusterCriteria.compare );
		clusters.push.apply(clusters,slice);
		if(isReversed){
			clusters.reverse();
		}
		this.colors = clusters;
		return this;
	},
	/**
	* Switches all list colors to their complementary color.
	* @return itself
	*/
	complement: function(){
		this.each(function(c){
			c.complement();
		});
		return this;
	},
	/**
	* Checks if the given color is part of the list. Check is done by value,
	* not instance.
	* @param color
	* @return true, if the color is present.
	*/
	contains: function(color){
		for( var i=0, l= this.colors.length; i<l; i++){
			if( this.colors[i].equals( color ) ){
				return true;
			}
		}
		return false;
	},
	each: function( fn ){
		each( this.colors, fn );
		return this;
	},
	/**
	* Returns the color at the given index. This function follows Python
	* convention, in that if the index is negative, it is considered relative
	* to the list end. Therefore the color at index -1 is the last color in the
	* list.
	* @param i
	*            index
	* @return color
	*/
	get: function(i){
		if(i < 0){
			i += this.colors.length;
		}
		return this.colors[i];
	},
	/**
	* Calculates and returns the average color of the list.
	* @return average color or null, if there're no entries yet.
	*/
	getAverage: function(){
		var r = 0,
			g = 0,
			b = 0,
			a = 0;

		this.each(function(c){
			r += c.rgb[0];
			g += c.rgb[1];
			b += c.rgb[2];
			a += c.alpha();
		});

		var num = this.colors.length;
		if(num > 0){
			return TColor.newRGBA(r / num, g / num, b / num, a / num);
		}
		return undefined;
	},
	/**
	* Creates a new ColorList by blending all colors in the list with each
	* other (successive indices only)
	* @param amount
	*            blend amount
	* @return new color list
	*/
	getBlended: function(amount){
		var clrs = [],
			len = this.colors.length;
		for(var i=0; i< len; i++){
			var index = i > 0 ? i -1 : clrs.length - 1,
				c = this.colors[index];
			clrs.push(this.colors[i].getBlended(c,amount));
		}
		return new ColorList(clrs);
	},
	/**
	* Finds and returns the darkest color of the list.
	* @return darkest color or null if there're no entries yet.
	*/
	getDarkest: function(){
		var darkest,
			minBrightness = Number.MAX_VALUE;
		this.each(function(c){
			var luma = c.luminance();
			if(luma < minBrightness){
				darkest = c;
				minBrightness = luma;
			}
		});
		return darkest;
	},
	/**
	* Finds and returns the lightest (luminance) color of the list.
	* @return lightest color or null, if there're no entries yet.
	*/
	getLightest: function(){
		var lightest,
			maxBrightness = Number.MIN_VALUE;
		this.each(function(c){
			var luma = c.luminance();
			if(luma > maxBrightness){
				lightest = c;
				maxBrightness = luma;
			}
		});
		return lightest;
	},

	getRandom: function(){
		var index = Math.floor(mathUtils.random(this.colors.length));
		return this.colors[index];
	},

	getReverse: function(){
		return new ColorList(this.colors).reverse();
	},

	invert: function(){
		this.each(function(c){
			c.invert();
		});
		return this;
	},

	iterator: function(){
		return new Iterator(this.colors);
	},

	reverse: function(){
		this.colors.reverse();
		return this;
	},

	rotateRYB: function(theta, isRadians){
		var angle;
		if(theta !== Math.floor(theta) || isRadians){
			angle = mathUtils.degrees(theta);
		} else {
			angle = theta;
		}
		this.each(function(c){
			c.rotateRYB(angle);
		});
		return this;
	},

	size: function(){
		return this.colors.length;
	},

	sort: function(){
		return this.sortByCriteria(AccessCriteria.HUE, false);
	},
	/**
	* Sorts the list using the given comparator.
	* @param comp
	*            comparator
	* @param isReversed
	*            true, if reversed sort
	* @return itself
	*/
	sortByComparator: function(comp, isReversed){
        //if a normal ( a, b ) sort function instead of an AccessCriteria,
        //wrap it so it can be invoked the same
        if( typeof comp === 'function' && typeof comp.compare === 'undefined' ){
            comp = { compare: comp };
        }
		this.colors.sort( comp.compare );
		if(isReversed){
			this.colors.reverse();
		}
		return this;
	},
	/**
	* Sorts the list using the given {@link AccessCriteria}.
	* @param criteria
	*            sort criteria
	* @param isReversed
	*            true, if reversed sort
	* @return itself
	*/
	sortByCriteria: function(criteria, isReversed){
		return this.sortByComparator(criteria, isReversed);
	},
	/**
	* Sorts the list by relative distance to each predecessor, starting with
	* the darkest color in the list.
    * @param {toxi.color.*{DistanceProxy}} proxy
	* @param isReversed
	*            true, if list is to be sorted in reverse.
	* @return itself
	*/

	sortByDistance: function(proxy, isReversed){
		if(arguments.length === 1){
			isReversed = arguments[0];
			proxy = new HSVDistanceProxy();
		}

		if(this.colors.length === 0){
			return this;
		}

		// Remove the darkest color from the stack,
		// put it in the sorted list as starting element.
		var root = this.getDarkest(),
			stack = this.colors.slice(0),
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
		this.colors = sorted;
		return this;
	},
	/**
	* Sorts the list by proximity to the given target color (using RGB distance
	* metrics).
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
		var array = [];
		this.each(function(c){
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


ColorList.createUsingStrategy = function(){
    throw new Error('Not allowed, use toxi/color/createListUsingStrategy instead');
};

module.exports = ColorList;
});
