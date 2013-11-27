/*
 * wijcollections
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

;( function( undefined ) {
    'use strict';

    require.config( {
        baseUrl: "../",
        paths: {
            'wijcModules': 'lib/modules',
            'md5': 'lib/modules/utils'
        }
    } );

    require( ['wijcModules/public/List'], function( List ) {
        var foo = new List();

        foo.add( 'bar' );
        foo.add( {'baz': 1} );

        // console.warn( 'List contains ' + foo.size() + ' elements:' );
        // console.warn( foo.toString() );
        // console.warn( 'The object is:', foo.get( 1 ) );

        // // adding a duplicate entry
        // foo.add( {'baz': 1} );

        // // iterating unique entries
        // for( var i = 0, iMax = foo.size(); i < iMax; i++ ) {
        //     console.warn( 'unique entry', foo.get( i ) );
        // }
    } );
}() );
