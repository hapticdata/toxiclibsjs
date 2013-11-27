define(['./theory/colorTheoryRegistry'], function( ColorTheoryRegistry ){
    /**
    * Factory method. Creates a new ColorList based on the given
    * {@link ColorTheoryStrategy} instance and the given source color. The
    * number of colors returned will vary with the strategy chosen.
    * @param {string|toxi.color.theory.*Strategy} strategy either a string
    * for a strategy, such as "splitComplementary" or an instance of a strategy
    * @param {toxi.color.TColor} c a color to base the strategy off
    * @return {toxi.color.ColorList} new list
    */
    return function(strategy, c){
        if(typeof strategy == 'string'){
            strategy = ColorTheoryRegistry.getStrategyForName(strategy);
        }
        var list;
        if(strategy !== undefined){
            list = strategy.createListFromColor(c);
        }
        return list;
    };
});
