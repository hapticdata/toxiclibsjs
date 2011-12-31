#Moving from Processing to Processing.js w/ Toxiclibs.js

If you are targeting both [Processing](http://processing.org) and [Processing.js](http://processingjs.org) there are a couple things to keep in mind.

+ Load the toxiclibs.js script in your html file before loading processing.js: 

		<script type="text/javascript" src="js/toxiclibs.js"></script>

+ Either always reference the package and class in entirety *(i.e. toxi.geom.Vec2D instead of just Vec2D)* that uses a toxiclibs class, or add brief javascript to the beginning of your sketch that adds these to the global object:

		
		<script type="application/processing">
			//you can assign these classes to variables on the global object
			var	Vec2D = toxi.geom.Vec2D,
				ToxiclibsSupport = toxi.processing.ToxiclibsSupport,
				TColor = toxi.color.TColor;
			//you can jump straight into processing syntax
			Vec2D center;
			ToxiclibsSupport gfx;
			void setup(){
				size(800,600);
				gfx = new ToxiclibsSupport(this);
				center = new Vec2D(width,height).scaleSelf(0.5);
			}
		</script>

+ avoid using *for( Object obj : objects )* loops, JavaScript does not support these
+ Using the [toxi.processing.ToxiclibSupport class](http://github.com/hapticdata/toxiclibsjs/lib/processing/ToxiclibsSupport.js) can help make your sketches more consistent
	
