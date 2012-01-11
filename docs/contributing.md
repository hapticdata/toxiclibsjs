#Contributing to Toxiclibsjs

Contributions to toxiclibsjs are appreciated, users who would like to contribute are encouraged to [fork the github repository](http://github.com/hapticdata/toxiclibsjs) and send a [pull request](https://github.com/hapticdata/toxiclibsjs/pulls) when they have tested their contribution and are ready for it to be merged into the library. Small fixes may be committed and pulled, or you may [leave an issue](https://github.com/hapticdata/toxiclibsjs/issues) and I will fix it myself.

#Contribution rules

* All code must be written to the [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) specification.
* The top priority of all code is to follow the functionality and public API of [the original toxiclibs](http://toxiclibs.org). The aim is for there to be no exceptions, if for some reason there is, it must be clearly commented and mentioned in the pull request.
* Extend classes using the [internals module](http://github.com/hapticdata/toxiclibsjs/lib/internals.js)
* Do not use methods such as \__defineGetter__\, or other methods that were not supported by older browsers. [forEach](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach) can be used through the [internals module](http://github.com/hapticdata/toxiclibsjs/lib/internals.js) if desired.
* Do not write code that is tied to a specific environment, if possible *(i.e. dont use 'window' or 'document' variables as those will not be available in a Node.js environment)*
* Protected variables should begin with a single underscore *_myVar*, private variables should begin with two underscores *__myVar*. If the variable is private or protected but has a getter and setter, the variable should be public.