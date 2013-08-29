#toxi.color - _colorutils_
Ported to JavaScript by [Kyle Phillips](http://haptic-data.com) original library by [Karsten Schmidt](http://postspectacular.com). Parts of _colorutils_ were inspired and bits ported from Tom De Smedt & Frederik De Bleser for the "colors" library of [Nodebox.net](http://nodebox.net).

* [TColor](#tcolor) - floating point color datatype in 3 simultaneous spaces: RGB, HSV, CMYK
* [NamedColor](#namedcolor) - named color presets/constants
* [ColorList](#colorlist) - color list
* [ColorTheme](#colortheme) - weighted color theme generator
* [ColorRange](#) - constrain ranges of hue, saturation, brightness, alpha and use them as creation rules for new colors 
* [Strategies - toxi.color.theory.*](#strategies---toxicolortheory) - color theory strategies
* [Accessors and Distance Proxies](#access-criteria-and-distance-proxies) - extensive color sorting features
* [ColorGradient](#colorgradient) - multi-color gradient class
* [ToneMap](#tonemap) - tonemap

read [original javadocs](http://toxiclibs.org/docs/colorutils/) for complete documentation

##TColor
TColor [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/TColor.js) is the cornerstone of _colorutils_. It represents any 32-bit color in 3 simultaneous spaces with number values between 0 - 1. It provides many convenient methods for conversion to other colors and output into other formats.


	//make a new color with RGB values:
	var c1 = toxi.color.TColor.newRGB( 1.0, 0.5, 0.75 );
	//get a new random color:
	var c2 = toxi.color.TColor.newRandom();
	//get a 3rd color that is a blend of the two:
	var c3 = c1.getBlended( c2, 0.5 );
	//adjust the hue, saturation, brightness, relatively
	c3.adjustHSV( 0.0, 0.2, 0.4 );
	//set the saturation absolutely
	c2.setSaturation( 1.0 );
	
	//set a css attribute on a dom element
	document.body.style.backgroundColor = c1.toRGBCSS();
	//=> 'rgb(255,127,191)'
	
	//make a TColor from a css attribute
	var c4 = toxi.color.TColor.newCSS( document.body.style.color );
	

##NamedColor
NamedColor [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/NamedColor.js) is a convenient way to get a TColor based on the name of any [x11 color](http://en.wikipedia.org/wiki/X11_color_names#Color_name_charts).

	//get a TColor by name
	var color = toxi.color.NamedColor.getForName('bark');
	//get an array of all names
	var allNames = toxi.color.NamedColor.getNames();
	//=>[ 'INDIANRED', 'LIGHTCORAL',… ]
	
	
##ColorList
ColorList [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ColorList.js) is a collection of colors. You can simply `#add( tcolor )`, apply adjustments such as `#adjustBrightness( step )` or `#adjustSaturation( step )` to all of them at once, sort them by a [criteria or distance](#access-criteria-and-distance-proxies) and much more.

	var list = new toxi.color.ColorList("my-palette");
	list.add( toxi.color.TColor.newRGB( 0.8, 0.5, 0.2) );
	//fancy way to add all of the colors to the list using Array#map 	list.addAll([
		'aquamarine',
		'springgreen',
		'burgundy'
	].map(toxi.color.NamedColor.getForName));
	
	list.contains( toxi.color.NamedColor.getForName('burgundy') );
	//=> true
	list.contains( toxi.color.TColor.newRGB( 0.8, 0.5, 0.2) );
	//=> true
	list.contains( toxi.color.TColor.newRGB( 0.5, 0.5, 0.5) );
	//=> false
	
	var aquamarine = list.get(1);
	var rand = list.getRandom();
	

##ColorTheme
ColorTheme [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ColorTheme.js) is a weighted collection of ColorRange's used to define custom palettes with a certain balance between individual colors/shades. New theme parts can be added via textual descriptors referring to one of the preset ColorRange's and/or NamedColor's, e.g. `"warm springgreen"`. For each theme part a weight has to be specified. The magnitude of the weight value is irrelevant and is only important in relation to the weights of other theme parts.

[view the ColorRange descriptors here](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ColorRange.js#L316-L326)

	//make a theme
	var theme = new toxi.color.ColorTheme("myTheme");
	theme
		.addRange("soft aliceblue", 1)
		.addRange("bright aquamarine", 0.5)
		.addRange("warm brown", 1)
		.addRange("intense indianred", 1)
		.addRange( toxi.color.ColorRange.BRIGHT, toxi.color.NamedColor.GOLD, 0.5)
		.addRange( toxi.color.ColorRange.BRIGHT, toxi.color.TColor.newRandom(), 0.25 );
	//get a ColorList with 200 colors
	var list = theme.getColors(200);
	//get a random color that is within the theme
	var tcolor = theme.getColor();
	


##Strategies - toxi.color.theory.*
The `toxi.color.theory.*` [package](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/theory/) has several strategies for generating harmonious color palettes from a single color. Instances of these strategies, such as _AnalagousStrategy, ComplementaryStrategy, TriadTheoryStrategy, etc._ all define a function `createListFromColor( sourceTColor )` that returns a `ColorList` of harmonious colors.

	//make a ColorList based off the TriadTheoryStrategy
	var color = toxi.color.NamedColor.getForName('aquamarine');
	var colorList = new toxi.color.theory.TriadTheoryStrategy().createListFromColor(color);
	
	//a 2nd way of doing this (with analagous)
	colorList = toxi.color.theory.ColorTheoryRegistry.ANALAGOUS.createListFromColor(color);
	
	//a 3rd way of doing the same thing (this time with complementary)
	colorList = toxi.color.createListUsingStrategy("complementary", color);
	
	toxi.color.theory.ColorTheoryRegistry.getRegisteredNames()
	// => [ 'complement', 'complementary','splitComplementary','leftSplitComplementary','rightSplitComplementary','analagous','monochrome','triad','tetrad','compound' ]

	
##ColorRange

	var list = new toxi.color.createUsingStrategy("rightSplitComplementary", toxi.color.NamedColor.LIME);
	range = new toxi.color.ColorRange(list).addBrightnessRange(0,1);
	var longList = range.getColors(100);
	//specify a custom variance, getColors( [tcolor], [numToGenerate], [variance] );
	var customVarianceList = range.getColors( undefined, 100, 0.5);
	

##Access Criteria and Distance Proxies
AccessCriteria [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/AccessCriteria.js) includes a single instance of each of the different ways to compare colors: _AlphaAccessor, CMYKAccessor, HSVAccessor, LuminanceAccessor, RGBAccessor_

The distance proxies, _CMYKDistanceProxy, HSVDistanceProxy, RGBDistanceProxy_ allow you to sort colors based on their distance to each-other.

	//make a list from a strategy
	var list = toxi.color.createListUsingStrategy("triad", toxi.color.NamedColor.AQUAMARINE);
	//sort the list by hue, true = reverse to descending order
	list.sortByCriteria( toxi.color.AccessCriteria.HUE, true );
	
	//sort the list by its relative distance to each predecessor, starting with the darkest color
	list.sortByDistance( new toxi.color.HSVDistanceProxy() );


##ColorGradient
ColorGradient [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ColorGradient.js) models a multi-color gradient and allows you to receive a `ColorList` of the gradient at any resolution and with custom [interpolators](#).

	var grad = new toxi.color.ColorGradient(),
		numColors = 10;
	for( var i=0; i<numColor; i++){
		grad.addColorAt( i, toxi.color.TColor.newHSV(i/numColors, 1.0, 1.0) );
	}
	//get a colorlist of the original gradient
	var list = grad.calcGradient();
	//list.length => 10
	//get a gradient with the colors blended into a resolution of 20
	list = grad.calcGradient(0, 20);
	//list.length => 20
	list = grad.calcGradient(10, 20);


##ToneMap

ToneMap [(source)](https://github.com/hapticdata/toxiclibsjs/blob/master/lib/toxi/color/ToneMap.js) allows you to map a numerical input range to a gradient of colors. In the following example the colors of a flame are mapped to a sine wave:


	var grad = new toxi.color.ColorGradient();
	//add these colors to the gradient, at the specified locations
	[[0,'black'],[128,'red'],[196,'yellow'],[255,'white']].forEach(function(stop, i, arr){
		grad.addColorAt( stop[0], toxi.color.NamedColor.getForName(stop[1]) );
	});
	//map the gradient to the sine wave's values between 0.0-1.0
	var toneMap = new toxi.color.ToneMap( 0.0, 1.0, grad)
	var wave = new toxi.math.SineWave(0, 0.01);
	for( var i=0; i<freq; i++{
		color = toneMap.getToneFor( wave.update() );
		//do something with color
	}
