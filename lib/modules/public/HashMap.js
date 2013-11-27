/*
 * wijcollections - HashMap
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/public/HashMap", ['wijcModules/private/AbstractCollection', 'wijcModules/private/ListObject'], function( AbstractCollection, ListObject ) {
    function HashMap() {
        console.warn( 'constructing new hash map' );
        var that = this;

        that.keyList = []; // stores the original keys
        that.valueList = new ListObject(); // stores the values
        that.keyHashToValueHash = {}; // stores hash values of the key to the value
        that.keyHashToKey = {}; // maps hash of keys to the orginal keys
    }

    HashMap.prototype = new AbstractCollection();
    HashMap.prototype.constructor = HashMap;

    HashMap.prototype.clear = function() {
        // body...
    };

    HashMap.prototype.clone = function() {
        // body...
    };

    HashMap.prototype.containsKey = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.containsValue = function( value ) {
        console.warn( value );
    };

    HashMap.prototype.entrySet = function() {
        // body...
    };

    HashMap.prototype.get = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.isEmpty = function() {
        // body...
    };

    HashMap.prototype.keySet = function() {
        // body...
    };

    // return null if key is new, else old value
    HashMap.prototype.put = function( key, value ) {
        if( key === undefined || value === undefined || key === null ) {
            return null;
        }

        var keyHash = this.needsHashing( key ) ? this.getHash( key ) : key,
            valueHash = this.needsHashing( value ) ? this.getHash( value ) : value;

        // the key is already present in our list
        if( this.keyHashToKey[keyHash] !== undefined ) {
            console.warn( 'ALREADY THERE' );
        }

        // check if the key already exists
        // @TODO
        this.keyList.push( key );

        // add the original value to the interal ListObject instance
        this.valueList.add( value );

        // map the keyHash to the valueHash
        this.keyHashToValueHash[keyHash] = valueHash;

        // map the hashKey to the original key
        this.keyHashToKey[keyHash] = key;
    };

    HashMap.prototype.putAll = function( keyValueObject ) {
        console.warn( keyValueObject );
    };

    HashMap.prototype.remove = function( key ) {
        console.warn( key );
    };

    HashMap.prototype.size = function() {
        // body...
    };

    HashMap.prototype.values = function() {
        // body...
    };

    return HashMap;
} );
