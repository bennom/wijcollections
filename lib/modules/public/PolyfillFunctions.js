/*
 * wijcollections - Polyfill Functions
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
define( "wijcModules/PolyfillFunctions", function() {
    if( !Array.prototype.indexOf ) {
        Array.prototype.indexOf = function ( searchElement /*, fromIndex */ ) {
            'use strict';
            if( this == null ) {
                throw new TypeError();
            }

            var n, k, t = Object( this ),
                len = t.length >>> 0;

            if( len === 0 ) {
                return -1;
            }

            n = 0;

            if( arguments.length > 1 ) {
                n = Number( arguments[1] );

                if( n !== n ) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if( n !== 0 && n !== Infinity && n !== -Infinity ) {
                    n = (n > 0 || -2) * Math.floor( Math.abs( n ) );
                }
            }

            if( n >= len ) {
                return -1;
            }

            for( k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 ); k < len; k++ ) {
                if( k in t && t[k] === searchElement ) {
                    return k;
                }
            }

            return -1;
        };
    }

    /**
     * JSON Polyfills
     * @see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FJSON#Browser_compatibility
     *
     * This polyfill will only for IE 8+
     */
    if( !window.JSON ) {
        window.JSON = {
            parse: function( sJSON ) {
                return eval( "(" + sJSON + ")" );
            },

            stringify: function( vContent ) {
                if( vContent instanceof Object ) {
                    var sOutput = "";

                    if( vContent.constructor === Array ) {
                        for( var nId = 0; nId < vContent.length; sOutput += this.stringify( vContent[nId] ) + ",", nId++ ) {}
                        return "[" + sOutput.substr( 0, sOutput.length - 1 ) + "]";
                    }

                    if( vContent.toString !== Object.prototype.toString ) {
                        return "\"" + vContent.toString().replace( /"/g, "\\$&" ) + "\"";
                    }

                    for( var sProp in vContent ) {
                        sOutput += "\"" + sProp.replace( /"/g, "\\$&") + "\":" + this.stringify( vContent[sProp] ) + ",";
                    }

                    return "{" + sOutput.substr( 0, sOutput.length - 1 ) + "}";
                }

                return typeof vContent === "string" ? "\"" + vContent.replace( /"/g, "\\$&" ) + "\"" : String( vContent );
            }
        };
    }
} );
