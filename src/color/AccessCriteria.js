(function(){
	/**
	* Defines standard color component access criterias and associated comparators
	* used to sort colors based on component values. If a new custom accessor is
	* needed (e.g. for sub-classes TColor's), then simply sub-class this class and
	* implement the {@link Comparator} interface and the 2 abstract getter & setter
	* methods defined by this class.
	*/
	var AccessCriteria = {
		HUE: new toxi.color.HSVAccessor(0),
		SATURATION: new toxi.color.HSVAccessor(1),
		BRIGHTNESS: new toxi.color.HSVAccessor(2),

		RED: new toxi.color.RGBAccessor(0),
		GREEN: new toxi.color.RGBAccessor(1),
		BLUE: new toxi.color.RGBAccessor(2),

		CYAN: new toxi.color.CMYKAccessor(0),
		MAGENTA: new toxi.color.CMYKAccessor(1),
		YELLOW: new toxi.color.CMYKAccessor(2),
		BLACK: new toxi.color.CMYKAccessor(3),

		ALPHA: new toxi.color.AlphaAccessor(),
		LUMINANCE: new toxi.color.LuminanceAccessor()
	};

	toxi.color.AccessCriteria = AccessCriteria;

}())