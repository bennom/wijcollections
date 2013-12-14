# wijcollections #

[![Build Status](https://travis-ci.org/webinfluenza/wijcollections.png?branch=master)](https://travis-ci.org/webinfluenza/wijcollections) A Java like Collection Framework.


### Demo / Playground
[Demo / Playground](http://jsfiddle.net/webinfluenza/hNqPE/ "jsfiddle playground") - here you go. Feel free to fiddle around.


### API Documentation
... can be found [here](http://www.webinfluenza.de/wijcollections/doc/ "Official Documentation") (YUIDoc)


### Installation / Usage
#### RequireJS Version
Download or clone this repository and put the `lib/modules` folder in your desired location. Apply your config file to find this folder. In your JavaScript file you can simply require the modules of the `public` folder, e.g.:
```
require( ['path/to/modules/public/List'], function( List ) {
   var myList = new List();
} );
```

#### Non RequireJS Version
Download the [compressed](https://github.com/webinfluenza/wijcollections/blob/not-required/dist/wijcollections.min.js) version, include the file in your project and that's it. Easy-peasy :-)


### Actually implemented collections
* List, [Documentation](http://www.webinfluenza.de/wijcollections/doc/classes/List.html "List API Documentation")
* HashMap [Documentation](http://www.webinfluenza.de/wijcollections/doc/classes/HashMap.html "HashMap API Documentation")
* Stack, [Documentation](http://www.webinfluenza.de/wijcollections/doc/classes/Stack.html "Stack API Documentation")

### Browser Compatibility
Tested on all actual major Browsers. Internet Explorer 9+ is supported. There are plans to also support Internet Explorer 8 in the future.

### Release History
Date | Version | Release Notes
:------------|:-------:|:-----
13.12.13 | 2.0.0 | ```HashMap``` implementation, API changes, more tests
01.11.13 | 1.2.0 | introducing ```Stack``` class
28.10.13 | 1.1.0 | ```List``` implementation of ```set()```
27.10.13 | 1.0.0 | ```List``` production ready release
