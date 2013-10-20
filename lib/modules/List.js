/*
 * wijcollections - List
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/List", ['wijcModules/AbstractCollection'], function( AbstractCollection ) {
    /**
     * List constructor
     */
    function List() {
        var that = this;

        that.list = [];
    }

    // inherit from base class AbstractCollection
    List.prototype = new AbstractCollection();
    List.prototype.constructor = List;

    /**
     * Appends an element at the end of the list
     * @param  {Object} element element to be appended to the list
     * @return {Boolean}        true if the element was appended
     */
    List.prototype.add = function( element ) {
        // only append the element if it's actually an element
        if( element !== undefined ) {
            this.list.push( element );
            return true;
        } else {
            return false;
        }
    };

    /**
     * Insert the given element at the specified position in the the list
     * @param  {Object} element the specified element to insert
     * @param  {Number} index   Index at which the specified element is to be inserted
     * @return {Boolean}        true if the element was inserted
     */
    List.prototype.addAt = function( element, index ) {
        if( element !== undefined ) {
            var listLength = this.size();

            // if an index is set, try to insert the element on the
            // index position
            if( index !== undefined && index.constructor === Number ) {
                if( index === 0 ) {
                    // first position -> do an unshift operation
                    this.list.unshift( element );
                    return true;
                } else if( index > 0 && index < (listLength - 1) ) {
                    // in the middle of the array
                    this.list.splice( index, 0, element );
                    return true;
                } else if( index >= (listLength - 1) ) {
                    // index is higher or equal the array length
                    this.list.push( element );
                    return true;
                } else {
                    // something's wrong in Denmark :-/
                    return false;
                }
            } else {
                // no index was given, simply push the element to the ned
                this.list.push( element );
                return true;
            }
        } else {
            // we need one valid element at least
            return false;
        }
    };

    /**
     * Returns the number of elements the list is containing
     * @return {Number} element count
     */
    List.prototype.size = function() {
        return this.list.length;
    };

    return List;
} );
