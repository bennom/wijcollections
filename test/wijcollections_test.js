;( function( $ ) {
    // false, because we have to wait until the modules
    // are loaded actually
    QUnit.config.autostart = false;

    // run the tests when the module is loaded
    require( [
        'test_modules/AbstractCollection.test.js',
        'test_modules/List.test.js',
        'test_modules/Stack.test.js',
        'test_modules/HashMap.test.js'
        ], function() {
            QUnit.start();
    } );
}( jQuery ) );
