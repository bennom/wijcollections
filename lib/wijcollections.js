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
            'wijcModules': 'lib/modules'
        }
    } );

    require( ['wijcModules/AbstractCollection'], function( ac ) {
        // console.warn( ac );
    } );
}() );
