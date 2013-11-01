# wijcollections #

A Java like Collection Framework.

### Installation / Usage
#### RequireJS Version
Download or clone this repository and put the `dist/modules` folder in your desired location. Apply your config file to find this folder. In your JavaScript file you can simply require the modules of the `public` folder, e.g.:
```
require( ['path/to/modules/public/List'], function( List ) {
   var myList = new List();
   // have fun with List API
} );
```

#### Non RequireJS Version
Switch to the `not-required` [Branch](https://github.com/webinfluenza/wijcollections/tree/not-required "Non RequireJS Branch"). Download either the [compressed](https://github.com/webinfluenza/wijcollections/blob/not-required/dist/wijcollections.min.js) or [developer](https://github.com/webinfluenza/wijcollections/blob/not-required/dist/wijcollections.js) version.

Include one of the files in your project and that's it.

### Actually implemented collections
* List, [Documentation](https://github.com/webinfluenza/wijcollections/wiki/List "List API Documentation")
* Stack, [Documentation](https://github.com/webinfluenza/wijcollections/wiki/Stack "Stack API Documentation")

### Demo

If you download or clone this repository and you can use the *test/wijcollections_test.html* file for playing around.
This file includes the *lib/wijcollections.js*. There you can see how to use the collection and you can
play around with it. Have fun.

### Generate Documentation
If you have cloned or downloaded this repo, just run
```
npm install
grunt yuidoc
```
to generate the documentation. The documenation will not be commited in this repository.

## Release History
Date | Version | Release Notes
:------------|:-------:|:-----
01.11.13 | 1.2.0 | introducing ```Stack``` class
28.10.13 | 1.1.0 | ```List``` implementation of ```set()```
27.10.13 | 1.0.0 | ```List``` production ready release
