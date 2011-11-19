// uncompressed/toxi-color-debug r43 - http://github.com/hapticdata/toxiclibsjs
toxi.color = toxi.color || {};
(function(){

	//private
	//http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
	//TLDR: not as straightforward as i.toString(16)
	var dec2hex = function(i) {
	  var result = "0000";
	  if      (i >= 0    && i <= 15)    { result = "000" + i.toString(16); }
	  else if (i >= 16   && i <= 255)   { result = "00"  + i.toString(16); }
	  else if (i >= 256  && i <= 4095)  { result = "0"   + i.toString(16); }
	  else if (i >= 4096 && i <= 65535) { result =         i.toString(16); }
	  return result;
	};
	
	toxi.color.TColor = function(tcolor){
		this.rgb = new Array(3);
		this.hsv = new Array(3);
		this.cmyk = new Array(4);
		this._alpha = 1.0;
		if(tcolor !== undefined){
			var buffer = tcolor.toCMYKAArray();
			this.cmyk = buffer.splice(0,4);
			this.hsv = tcolor.toHSVAArray().splice(0,3);
			this.rgb = tcolor.toRGBAArray().splice(0,3);
			this._alpha = tcolor._alpha;
		}
	};
	
	toxi.color.TColor.prototype = {
		
		add: function(c){
			return this.copy().addSelf(c);
		},
		
		addSelf: function(c) {
			this.rgb[0] = toxi.MathUtils.min(this.rgb[0] + c.rgb[0], 1);
		    this.rgb[1] = toxi.MathUtils.min(this.rgb[1] + c.rgb[1], 1);
		    this.rgb[2] = toxi.MathUtils.min(this.rgb[2] + c.rgb[2], 1);
		    return this.setRGB(rgb);
		},
		
		/**
		 * Changes the brightness of the color by the given amount in the direction
		 * towards either the black or white point (depending on if current
		 * brightness >= 50%)
		 * 
		 * @param amount
		 * @return itself
		 */
		adjustConstrast: function(amount) {
		    return this.hsv[2] < 0.5 ? this.darken(amount) : this.lighten(amount);
		},
		
		
		/**
		 * Adds the given HSV values as offsets to the current color. Hue will
		 * automatically wrap.
		 * 
		 * @param h
		 * @param s
		 * @param v
		 * @return itself
		 */
		adjustHSV: function(h, s, v) {
		    return this.setHSV([ this.hsv[0] + h, this.hsv[1] + s, this.hsv[2] + v ]);
		},
		
		/**
		 * Adds the given RGB values as offsets to the current color. TColor will
		 * clip at black or white.
		 * 
		 * @param r
		 * @param g
		 * @param b
		 * @return itself
		 */
		adjustRGB: function(r, g,b) {
		    return this.setRGB([this.rgb[0] + r, this.rgb[1] + g, this.rgb[2] + b]);
		},
		
		alpha:function(){
			return this._alpha;
		},
		
		/**
		 * Rotates this color by a random amount (not exceeding the one specified)
		 * and creates variations in saturation and brightness based on the 2nd
		 * parameter.
		 * 
		 * @param theta
		 *            max. rotation angle (in radians)
		 * @param delta
		 *            max. sat/bri variance
		 * @return itself
		 */
		analog: function(theta, delta) {
		    var angle = toxi.MathUtils.degrees(theta);
			this.rotateRYB(angle * toxi.MathUtils.normalizedRandom());
			this.hsv[1] += delta * toxi.MathUtils.normalizedRandom();
			this.hsv[2] += delta * toxi.MathUtils.normalizedRandom();
			return this.setHSV(this.hsv);
		},
		
		//shouldnt this be this.cmyk[3]?
		black: function(){
			return this.cmyk[3];
		},
		/**
		 * Blends the color with the given one by the stated amount
		 * 
		 * @param c
		 *            target color
		 * @param t
		 *            interpolation factor
		 * @return itself
		 */
		blend: function(c, t) {
			if(t === undefined) { t = 0.5; }
		    var crgb = c.toRGBAArray();
		    this.rgb[0] += (crgb[0] - this.rgb[0]) * t;
		    this.rgb[1] += (crgb[1] - this.rgb[1]) * t;
		    this.rgb[2] += (crgb[2] - this.rgb[2]) * t;
		    this._alpha += (c.alpha() - this._alpha) * t;
		    return this.setRGB(this.rgb);
		},
		
		blue: function() {
			return this.rgb[2];
		},
		
		brightness: function(){
			return this.hsv[2];
		},
		
		complement: function(){
			return this.rotateRYB(180);
		},
		
		copy: function(){
			return new toxi.color.TColor(this);
		},
		
		cyan : function(){
			return this.cmyk[0];
		},
		
		darken: function(step){
			this.hsv[2] = toxi.MathUtils.clip((this.hsv[2] -step), 0, 1);
			return this.setHSV(this.hsv);
		},
		/**
		Reduced the color's saturation by the given amount. 
		@param step
		@return itself
		*/
		desaturate: function(step) {
		    this.hsv[1] = toxi.MathUtils.clip((this.hsv[1] - step), 0, 1);
		    return this.setHSV(this.hsv);
		},
	
		differenceTo: function(c) {
		    return  toxi.color.TColor.newRGB(Math.abs(this.rgb[0] - c.rgb[0]),
		            Math.abs(this.rgb[1] - c.rgb[1]),
		            Math.abs(this.rgb[2] - c.rgb[2]));
		},
		
		distanceToCMYK: function(c) {
		    var ccmyk = c.toCMYKAArray();
		    var dc = this.cmyk[0] - ccmyk[0];
		    var dm = this.cmyk[1] - ccmyk[1];
		    var dy = this.cmyk[2] - ccmyk[2];
		    var dk = this.cmyk[3] - ccmyk[3];
		    return Math.sqrt(dc * dc + dm * dm + dy * dy + dk * dk);
		},
		
		distanceToHSV: function(c) {
		    var hue = this.hsv[0] * toxi.MathUtils.TWO_PI;
		    var hue2 = c.hue() * toxi.MathUtils.TWO_PI;
		    var v1 =
		            new toxi.Vec3D((Math.cos(hue) * this.hsv[1]),
		                    (Math.sin(hue) * this.hsv[1]), this.hsv[2]);
		    var v2 =
		            new toxi.Vec3D((Math.cos(hue2) * c.saturation()),
		                    (Math.sin(hue2) * c.saturation()), c.brightness());
		    return v1.distanceTo(v2);
		},
		
		distanceToRGB: function(c) {
		    var crgb = c.toRGBAArray();
		    var dr = this.rgb[0] - crgb[0];
		    var dg = this.rgb[1] - crgb[1];
		    var db = this.rgb[2] - crgb[2];
		    return Math.sqrt(dr * dr + dg * dg + db * db);
		},
		
		equals: function(o) {
		    if (o !== undefined && o instanceof toxi.color.TColor) {
		        var c =  o;
		        var dr = c.rgb[0] - this.rgb[0];
		        var dg = c.rgb[1] - this.rgb[1];
		        var db = c.rgb[2] - this.rgb[2];
		        var da = c.alpha() - this._alpha;
		        var d = Math.sqrt(dr * dr + dg * dg + db * db + da * da);
		        return d < toxi.color.TColor.EPS;
		    }
		    return false;
		},
		
		getAnalog: function(theta,delta) {
		    return new toxi.color.TColor(this).analog(theta, delta);
		},
		
		getBlended: function(c,t) {
		    return new toxi.color.TColor(this).blend(c, t);
		},
		
		/*getClosestHue: function(primaryOnly) {
		    return Hue.getClosest(hsv[0], false,primaryOnly);
		},*/
		
		getComplement: function() {
		    return new toxi.color.TColor(this).complement();
		},
		
		getComponentValue: function(criteria) {
		    return criteria.getComponentValueFor(this);
		},
		
		getDarkened: function(step) {
		    return new toxi.color.TColor(this).darken(step);
		},
		
		getDesaturated: function(step) {
		    return new toxi.color.TColor(this).desaturate(step);
		},
		
		getDifferenceTo: function(c) {
		    return this.copy().differenceTo(c);
		},
		
		getInverted: function() {
		    return new toxi.color.TColor(this).invert();
		},
		
		getLightened: function(step) {
		    return new toxi.color.TColor(this).lighten(step);
		},
		
		getRotatedRYB: function(theta) {
		    return new toxi.color.TColor(this).rotateRYB(theta);
		},
		
		getSaturated: function(step) {
		    return new toxi.color.TColor(this).saturate(step);
		},
		
		green: function() {
		    return this.rgb[1];
		},
		
		hue: function() {
		    return this.hsv[0];
		},
		
		invert: function() {
		    this.rgb[0] = 1 - this.rgb[0];
		    this.rgb[1] = 1 - this.rgb[1];
		    this.rgb[2] = 1 - this.rgb[2];
		    return this.setRGB(this.rgb);
		},
		
		isBlack: function() {
		    return (this.rgb[0] <= toxi.color.TColor.BLACK_POINT && ((this.rgb[0]==this.rgb[1]) && this.rgb[0] == this.rgb[2]));
		},
		
		isGrey:function() {
		    return this.hsv[1] < toxi.color.TColor.GREY_THRESHOLD;
		},
		/*
		isPrimary:function() {
		    return Hue.isPrimary(this.hsv[0]);
		},*/
		
		isWhite: function() {
		    return (this.rgb[0] >= toxi.color.TColor.WHITE_POINT && (this.rgb[0] == this.rgb[1]) && (this.rgb[0] == this.rgb[2]));
		},
		
		lighten: function(step) {
		    this.hsv[2] = toxi.MathUtils.clip(this.hsv[2] + step, 0, 1);
		    return this.setHSV(this.hsv);
		},
		
		luminance: function() {
		    return this.rgb[0] * 0.299 + this.rgb[1] * 0.587 + this.rgb[2] * 0.114;
		},
		
		magenta: function() {
		    return this.cmyk[1];
		},
		
		red: function() {
		    return this.rgb[0];
		},
		
		rotateRYB: function(theta) {
			var deg = parseInt(toxi.MathUtils.degrees(theta),10),
				h = this.hsv[0] * 360,
				i = 0,
				p,
				q;
			theta %= 360;
	
		    var resultHue = 0;
		    for (i = 0; i < toxi.color.TColor.RYB_WHEEL.length - 1; i++) {
		        p = toxi.color.TColor.RYB_WHEEL[i];
		        q = toxi.color.TColor.RYB_WHEEL[i + 1];
		        if (q.y < p.y) {
		            q.y += 360;
		        }
		        if (p.y <= h && h <= q.y) {
		            resultHue = p.x + (q.x - p.x) * (h - p.y) / (q.y - p.y);
		            break;
		        }
		    }
	
		    // And the user-given angle (e.g. complement).
		    resultHue = (resultHue + theta) % 360;
	
		    // For the given angle, find out what hue is
		    // located there on the artistic color wheel.
		    for (i = 0; i < toxi.color.TColor.RYB_WHEEL.length - 1; i++) {
		        p = toxi.color.TColor.RYB_WHEEL[i];
		        q = toxi.color.TColor.RYB_WHEEL[i + 1];
		        if (q.y < p.y) {
		            q.y += 360;
		        }
		        if (p.x <= resultHue && resultHue <= q.x) {
		            h = p.y + (q.y - p.y) * (resultHue - p.x) / (q.x - p.x);
		            break;
		        }
		    }
	
		    this.hsv[0] = (h % 360) / 360.0;
		    return this.setHSV(this.hsv);
		
		},
		
		saturate: function(step) {
		    this.hsv[1] = toxi.MathUtils.clip(this.hsv[1] + step, 0, 1);
		    return this.setHSV(this.hsv);
		},
		
		saturation: function() {
		    return this.hsv[1];
		},
		
		setAlpha: function(alpha) {
		    this._alpha = alpha;
		    return this;
		},
		
		setARGB: function(argb) {
		    this.setRGB(((argb >> 16) & 0xff) * toxi.TColor.INV8BIT, ((argb >> 8) & 0xff) * toxi.TColor.INV8BIT, (argb & 0xff) * toxi.TColor.INV8BIT);
		    this._alpha = (argb >>> 24) * toxi.TColor.INV8BIT;
		    return this;
		},
		
		setBlack: function(val) {
		    this.cmyk[3] = val;
		    return this.setCMYK(cmyk);
		},
		
		setBlue: function(blue) {
		    this.rgb[2] = blue;
		    return this.setRGB(this.rgb);
		},
		
		setBrightness: function(brightness) {
		    this.hsv[2] = toxi.MathUtils.clip(brightness, 0, 1);
		    return this.setHSV(this.hsv);
		},
		
		setCMYK: function(c,m,y,k) {
			//if it was passed in as an array instead of separate values
			if(c instanceof Array){
				m = c[1];
				y = c[2];
				k = c[3];
				c = c[0];
			}
		    this.cmyk[0] = c;
		    this.cmyk[1] = m;
		    this.cmyk[2] = y;
		    this.cmyk[3] = k;
			this.rgb = toxi.color.TColor.cmykToRGB(this.cmyk[0],this.cmyk[1],this.cmyk[2],this.cmyk[3]);
			this.hsv = toxi.color.TColor.rgbToHSV(this.rgb[0],this.rgb[1],this.rgb[2]);
		    return this;
		},
		
		/*setComponent(AccessCriteria criteria, float val) {
		    criteria.setComponentValueFor(this, val);
		    return this;
		}*/
		
		setCyan: function(val) {
		    this.cmyk[0] = val;
		    return this.setCMYK(this.cmyk);
		},
	
		setGreen: function(green) {
		    this.rgb[1] = green;
		    return this.setRGB(this.rgb);
		},
	
		setHSV: function(h,s,v) {
			if(h instanceof Array){
				s = h[1];
				v = h[2];
				h = h[0];
			}
			var newHSV = [h,s,v];
		    this.hsv[0] = newHSV[0] % 1;
			if (this.hsv[0] < 0) {
				this.hsv[0]++;
			}
			this.hsv[1] = toxi.MathUtils.clip(newHSV[1], 0, 1);
			this.hsv[2] = toxi.MathUtils.clip(newHSV[2], 0, 1);
			this.rgb = toxi.color.TColor.hsvToRGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			this.cmyk = toxi.color.TColor.rgbToCMYK(this.rgb[0], this.rgb[1], this.rgb[2]);
			return this;
		},
		
		setHue: function(hue) {
		    hue %= 1.0;
		    if (hue < 0.0) {
		        hue++;
		    }
		    this.hsv[0] = hue;
		    this.setHSV(this.hsv);
		},
		
		setMagenta: function(val) {
		    this.cmyk[1] = val;
		    return this.setCMYK(this.cmyk);
		},
	
		setRed: function(red) {
		    this.rgb[0] = red;
		    return this.setRGB(this.rgb);
		},
	
		setRGB: function(r,g,b) {
			if(r instanceof Array)
			{
				g = r[1];
				b = r[2];
				r = r[0];
			}
		    this.rgb[0] = toxi.MathUtils.clip(r,0,1);
		    this.rgb[1] = toxi.MathUtils.clip(g,0,1);
		    this.rgb[2] = toxi.MathUtils.clip(b,0,1);
			this.cmyk = toxi.color.TColor.rgbToCMYK(this.rgb[0], this.rgb[1], this.rgb[2]);
			this.hsv = toxi.color.TColor.rgbToHSV(this.rgb[0], this.rgb[1], this.rgb[2]);
		    return this;
		},
		
		setSaturation: function(saturation) {
		    this.hsv[1] = toxi.MathUtils.clip(saturation, 0, 1);
		    return this.setHSV(this.hsv);
		},
	
		setYellow: function(val) {
		    this.cmyk[2] = val;
		    return this.setCMYK(this.cmyk);
		},
	
		sub: function(c) {
		    return this.copy().subSelf(c);
		},
		
		subSelf: function(c) {
		    this.rgb[0] = toxi.MathUtils.max(this.rgb[0] - c.rgb[0], 0);
		    this.rgb[1] = toxi.MathUtils.max(this.rgb[1] - c.rgb[1], 0);
		    this.rgb[2] = toxi.MathUtils.max(this.rgb[2] - c.rgb[2], 0);
		    return this.setRGB(this.rgb);
		},
		
		toARGB: function() {
			var r = parseInt((this.rgb[0] * 255),10),
				g = parseInt((this.rgb[1] * 255),10),
				b = parseInt((this.rgb[2] * 255),10),
				a = parseInt((this._alpha * 255),10);
		    return  r << 16 | g << 8 | b | a << 24;
		},
		
		toCMYKAArray: function(cmyka) {
		    if (cmyka === undefined) {
		        cmyka = [];
		    }
		    cmyka[0] = this.cmyk[0];
		    cmyka[1] = this.cmyk[1];
		    cmyka[2] = this.cmyk[2];
		    cmyka[3] = this._alpha;
		    return cmyka;
		},
		
		toHex: function() {
		    var hex = dec2hex(this.toARGB());
		    if (hex.length > 6) {
		        hex = hex.substring(2);
		    }
		    return hex;
		},
		
		toHSVAArray: function(hsva) {
		    if (hsva === undefined) {
		        hsva = [];
		    }
		    hsva[0] = this.hsv[0];
		    hsva[1] = this.hsv[1];
		    hsva[2] = this.hsv[2];
		    hsva[3] = this._alpha;
		    return hsva;
		},
		
		/**
		 * to an Array of RGBA values
		 * @param rgba
		 * @param offset (optional)
		 * @return rgba array
		 */
		toRGBAArray: function(rgba, offset) {
		    if (rgba === undefined) {
		        rgba = [];
		        offset = 0;
		    }
		    rgba[offset++] = this.rgb[0];
		    rgba[offset++] = this.rgb[1];
		    rgba[offset++] = this.rgb[2];
		    rgba[offset] = this._alpha;
		    return rgba;
		},
		
		toString: function(){
			return "toxi.color.TColor: rgb: "+this.rgb[0] + ", " +this.rgb[1] + ", "+this.rgb[2]+ 
					" hsv: "+ this.hsv[0] + ","+this.hsv[1]+","+this.hsv[2]+
					" cmyk: "+this.cmyk[0] + ", "+this.cmyk[1]+","+this.cmyk[2]+","+this.cmyk[3]+
					" alpha: "+this._alpha;
		},
		
		yellow: function() {
		    return this.cmyk[2];
		}
		
	};
	
	
	
	toxi.color.TColor.INV60DEGREES = 60.0 / 360;
	toxi.color.TColor.INV8BIT = 1.0 / 255;
	toxi.color.TColor.EPS = 0.001;
	/*
	    protected static final Vec2D[] RYB_WHEEL = new Vec2D[] { new Vec2D(0, 0),
	            new Vec2D(15, 8), new Vec2D(30, 17), new Vec2D(45, 26),
	            new Vec2D(60, 34), new Vec2D(75, 41), new Vec2D(90, 48),
	            new Vec2D(105, 54), new Vec2D(120, 60), new Vec2D(135, 81),
	            new Vec2D(150, 103), new Vec2D(165, 123), new Vec2D(180, 138),
	            new Vec2D(195, 155), new Vec2D(210, 171), new Vec2D(225, 187),
	            new Vec2D(240, 204), new Vec2D(255, 219), new Vec2D(270, 234),
	            new Vec2D(285, 251), new Vec2D(300, 267), new Vec2D(315, 282),
	            new Vec2D(330, 298), new Vec2D(345, 329), new Vec2D(360, 0) };
	*/
	
	/**
	 * Maximum rgb component value for a color to be classified as black.
	 * 
	 * @see #isBlack()
	 */
	toxi.color.TColor.BLACK_POINT = 0.08;
	
	/**
	 * Minimum rgb component value for a color to be classified as white.
	 * 
	 * @see #isWhite()
	 */
	toxi.color.TColor.WHITE_POINT = 1.0;
	
	/**
	 * Maximum saturations value for a color to be classified as grey
	 * 
	 * @see #isGrey()
	 */
	toxi.color.TColor.GREY_THRESHOLD = 0.01;
	
	
	
	/**
	 * Converts CMYK floats into an RGB array.
	 * 
	 * @param c
	 * @param m
	 * @param y
	 * @param k
	 * @param rgb optional rgb array to populate
	 * @return rgb array
	 */
	toxi.color.TColor.cmykToRGB = function(c,m,y,k,rgb) {
		if(rgb ===undefined){
			rgb = [0,0,0];
		}
		rgb[0] = 1.0 - Math.min(1.0, c + k);
		rgb[1] = 1.0 - Math.min(1.0, m + k);
		rgb[2] = 1.0 - Math.min(1.0, y + k);
		return rgb;
	};
	
	
	/**
	 * Converts hex string into a RGB array.
	 * 
	 * @param hexRGB
	 * @param rgb array optional
	 * @return rgb array
	 */
	toxi.color.TColor.hexToRGB = function(hexRGB,rgb) {
		if(rgb === undefined){ rgb = []; }
		//var rgbInt = parseInt(hexRGB,16);
		hexRGB = (hexRGB.charAt(0)=="#") ? hexRGB.substring(1,7):hexRGB;
		rgb[0] = parseInt(hexRGB.substring(0,2),16) * toxi.color.TColor.INV8BIT;//((rgbInt >> 16) & 0xff) * toxi.color.TColor.INV8BIT;
		rgb[1] = parseInt(hexRGB.substring(2,4),16) * toxi.color.TColor.INV8BIT;//((rgbInt >> 8) & 0xff) * toxi.color.TColor.INV8BIT;
		rgb[2] = parseInt(hexRGB.substring(4,6),16) * toxi.color.TColor.INV8BIT;//((rgbInt & 0xff) * toxi.color.TColor.INV8BIT);
	    return rgb;
	};
	
	
	/**
	 * Converts HSV values into RGB array.
	 * 
	 * @param h
	 * @param s
	 * @param v
	 * @param rgb array optional
	 * @return rgb array
	 */
	toxi.color.TColor.hsvToRGB = function(h, s, v,rgb) {
		if(rgb === undefined){ rgb = []; }
		if(s === 0.0){
			rgb[0] = rgb[1] = rgb[2] = v;
		} else {
			h /= toxi.color.TColor.INV60DEGREES;
			var i =  parseInt(h,10),
				f = h - i,
				p = v * (1 - s),
				q = v * (1 - s * f),
				t = v * (1 - s * (1 - f));
	
	        if (i === 0) {
	            rgb[0] = v;
	            rgb[1] = t;
	            rgb[2] = p;
	        } else if (i == 1) {
	            rgb[0] = q;
	            rgb[1] = v;
	            rgb[2] = p;
	        } else if (i == 2) {
	            rgb[0] = p;
	            rgb[1] = v;
	            rgb[2] = t;
	        } else if (i == 3) {
	            rgb[0] = p;
	            rgb[1] = q;
	            rgb[2] = v;
	        } else if (i == 4) {
	            rgb[0] = t;
	            rgb[1] = p;
	            rgb[2] = v;
	        } else {
	            rgb[0] = v;
	            rgb[1] = p;
	            rgb[2] = q;
	        }
	    }
	    return rgb;
	};
	
	/**
	 * Converts CIE Lab to RGB components.
	 * 
	 * First we have to convert to XYZ color space. Conversion involves using a
	 * white point, in this case D65 which represents daylight illumination.
	 * 
	 * Algorithm adopted from: http://www.easyrgb.com/math.php
	 * 
	 * @param l
	 * @param a
	 * @param b
	 * @param rgb
	 * @return rgb array
	 */
	toxi.color.TColor.labToRGB = function(l, a, b,rgb) {
		if(rgb === undefined){ rgb = []; }
	    var y = (l + 16) / 116.0,
			x = a / 500.0 + y,
			z = y - b / 200.0,
			i = 0;
	    rgb[0] = x;
	    rgb[1] = y;
	    rgb[2] = z;
	    for (i = 0; i < 3; i++) {
	        var p = Math.pow(rgb[i], 3);
	        if (p > 0.008856) {
	            rgb[i] = p;
	        } else {
	            rgb[i] = (rgb[i] - 16 / 116.0) / 7.787;
	        }
	    }
	
	    // Observer = 2, Illuminant = D65
	    x = rgb[0] * 0.95047;
	    y = rgb[1];
	    z = rgb[2] * 1.08883;
	
	    rgb[0] = x * 3.2406 + y * -1.5372 + z * -0.4986;
	    rgb[1] = x * -0.9689 + y * 1.8758 + z * 0.0415;
	    rgb[2] = x * 0.0557 + y * -0.2040 + z * 1.0570;
	    var tpow = 1 / 2.4;
	    for (i = 0; i < 3; i++) {
	        if (rgb[i] > 0.0031308) {
	            rgb[i] = (1.055 * Math.pow(rgb[i], tpow) - 0.055);
	        } else {
	            rgb[i] = 12.92 * rgb[i];
	        }
	    }
	    return rgb;
	};
	
	/**
	 * Factory method. Creates new color from ARGB int.
	 * 
	 * @param argb
	 * @return new color
	 */
	toxi.color.TColor.newARGB = function(argb) {
	    return toxi.color.TColor.newRGBA(((argb >> 16) & 0xff) * toxi.color.TColor.INV8BIT, ((argb >> 8) & 0xff) * toxi.color.TColor.INV8BIT, (argb & 0xff) * toxi.color.TColor.INV8BIT, (argb >>> 24) * toxi.color.TColor.INV8BIT);
	};
	
	/**
	Factory method. Creates new color from CMYK values. 
	@param c
	@param m
	@param y
	@param k
	@return new color
	*/
	toxi.color.TColor.newCMYK = function(c, m, y, k) {
	    return toxi.color.TColor.newCMYKA(c, m, y, k, 1);
	};
	
	/**
	Factory method. Creates new color from CMYK + alpha values. 
	@param c
	@param m
	@param y
	@param k
	@param a
	@return new color
	*/
	toxi.color.TColor.newCMYKA = function(c, m, y, k, a) {
	    var col = new toxi.color.TColor();
	    col.setCMYK([c, m, y, k ]);
	    col.setAlpha(toxi.MathUtils.clip(a, 0, 1));
	    return col;
	};
	
	/**
	Factory method. Creates a new shade of gray + alpha. 
	@param gray
	@return new color.
	*/
	toxi.color.TColor.newGray = function(gray) {
	    return toxi.color.TColor.newGrayAlpha(gray, 1);
	};
	
	toxi.color.TColor.newGrayAlpha = function(gray, alpha) {
	    var c = new toxi.color.TColor();
	    c.setRGB([gray, gray, gray ]);
	    c.setAlpha(alpha);
	    return c;
	};
	
	/**
	Factory method. New color from hex string. 
	@param hexRGB
	@return new color
	*/
	toxi.color.TColor.newHex = function(hexRGB) {
	    var c = new toxi.color.TColor();
	    c.setRGB(toxi.color.TColor.hexToRGB(hexRGB));
	    c.setAlpha(1);
	    return c;
	};
	
	/**
	Factory method. New color from hsv values. 
	@param h
	@param s
	@param v
	@return new color
	*/
	toxi.color.TColor.newHSV = function(h, s, v) {
	    return toxi.color.TColor.newHSVA(h, s, v, 1);
	};
	
	
	toxi.color.TColor.newHSVA = function(h, s,v,a) {
	    var c = new toxi.color.TColor();
	    c.setHSV(h, s, v);
	    c.setAlpha(toxi.MathUtils.clip(a, 0, 1));
	    return c;
	};
	
	/**
	Factory method. Creates new random color. Alpha is always 1.0. 
	@return random color
	*/
	toxi.color.TColor.newRandom = function() {
	    return toxi.color.TColor.newRGBA(Math.random(), Math.random(), Math.random(), 1);
	};
	
	/**
	Factory method. Creates new color from RGB values. Alpha is set to 1.0.
	@param r
	@param g
	@param b
	@return new color
	*/
	toxi.color.TColor.newRGB = function(r, g, b) {
	    return toxi.color.TColor.newRGBA(r, g, b, 1);
	};
	
	toxi.color.TColor.newRGBA = function( r, g, b, a) {
	    var c = new toxi.color.TColor();
	    c.setRGB([ r, g, b ]);
	    c.setAlpha(toxi.MathUtils.clip(a, 0, 1));
	    return c;
	};
	
	/**
	Converts the RGB values into a CMYK array. 
	@param r
	@param g
	@param b
	@param cmyk array optional
	@return cmyk array
	*/
	toxi.color.TColor.rgbToCMYK = function(r, g, b,cmyk) {
		if(cmyk === undefined){ cmyk = []; }
		cmyk[0] = 1 - r;
		cmyk[1] = 1 - g;
	    cmyk[2] = 1 - b;
	    cmyk[3] = toxi.MathUtils.min(cmyk[0], cmyk[1], cmyk[2]);
	    cmyk[0] = toxi.MathUtils.clip(cmyk[0] - cmyk[3], 0, 1);
	    cmyk[1] = toxi.MathUtils.clip(cmyk[1] - cmyk[3], 0, 1);
	    cmyk[2] = toxi.MathUtils.clip(cmyk[2] - cmyk[3], 0, 1);
	    cmyk[3] = toxi.MathUtils.clip(cmyk[3], 0, 1);
	    return cmyk;
	};
	
	
	/**
	Formats the RGB float values into hex integers. 
	@param r
	@param g
	@param b
	@return hex string
	*/
	toxi.color.TColor.rgbToHex = function(r, g, b) {
		var hex = dec2hex(toxi.MathUtils.clip(r, 0, 1) * 0xff) + dec2hex(toxi.MathUtils.clip(g, 0, 1) * 0xff) + dec2hex(toxi.MathUtils.clip(b, 0, 1) * 0xff);
		return hex;
	};
	
	/**
	Converts the RGB values into an HSV array. 
	@param r
	@param g
	@param b
	@param hsv optional
	@return hsv array
	*/
	toxi.color.TColor.rgbToHSV = function(r, g, b,hsv) {
		if(hsv ===undefined){ hsv = []; }
		var h = 0, 
			s = 0,
			v = toxi.MathUtils.max(r, g, b),
			d = v - toxi.MathUtils.min(r, g, b);
	
		if (v !== 0) {
			s = d / v;
		}
		if (s !== 0) {
			if (r == v) {
				h = (g - b) / d;
			} else if (g == v) {
				h = 2 + (b - r) / d;
			} else {
				h = 4 + (r - g) / d;
			}
		}
		h *= toxi.color.TColor.INV60DEGREES;
		if (h < 0) {
			h += 1.0;
		}
		hsv[0] = h;
		hsv[1] = s;
		hsv[2] = v;
		return hsv;
	};
	
	toxi.color.TColor.RED = toxi.color.TColor.newRGB(1, 0, 0);
	toxi.color.TColor.RYB_WHEEL = [ 
		new toxi.Vec2D(0, 0),
		new toxi.Vec2D(15, 8), new toxi.Vec2D(30, 17), new toxi.Vec2D(45, 26),
		new toxi.Vec2D(60, 34), new toxi.Vec2D(75, 41), new toxi.Vec2D(90, 48),
		new toxi.Vec2D(105, 54), new toxi.Vec2D(120, 60), new toxi.Vec2D(135, 81),
		new toxi.Vec2D(150, 103), new toxi.Vec2D(165, 123), new toxi.Vec2D(180, 138),
		new toxi.Vec2D(195, 155), new toxi.Vec2D(210, 171), new toxi.Vec2D(225, 187),
		new toxi.Vec2D(240, 204), new toxi.Vec2D(255, 219), new toxi.Vec2D(270, 234),
		new toxi.Vec2D(285, 251), new toxi.Vec2D(300, 267), new toxi.Vec2D(315, 282),
		new toxi.Vec2D(330, 298), new toxi.Vec2D(345, 329), new toxi.Vec2D(360, 0)
	];
	toxi.color.TColor.GREEN = toxi.color.TColor.newRGB(0, 1, 0);
	toxi.color.TColor.BLUE = toxi.color.TColor.newRGB(0, 0, 1);
	toxi.color.TColor.CYAN = toxi.color.TColor.newRGB(0, 1, 1);
	toxi.color.TColor.MAGENTA = toxi.color.TColor.newRGB(1, 0, 1);
	toxi.color.TColor.YELLOW = toxi.color.TColor.newRGB(1, 1, 0);
	toxi.color.TColor.BLACK = toxi.color.TColor.newRGB(0, 0, 0);
	toxi.color.TColor.WHITE = toxi.color.TColor.newRGB(1, 1, 1);

})();
