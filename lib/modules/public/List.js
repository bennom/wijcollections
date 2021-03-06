/*
 * wijcollections - List
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( ['private/AbstractCollection', 'private/ListObject'], function( AbstractCollection, ListObject ) {
    /**
     * List Collection constructor, inheriting from AbstractCollection Class.
     *
     * This list implementation will only store Strings directly in the
     * internal Array. Every other object type will be manage by ListObject class.
     * These store process will return a hash String for further use within the Array.
     * That hash String will be stored in the the actual Array.
     *
     * @constructor
     * @class List
     * @extends {AbstractCollection}
     * @implements {ListObject}
     * @todo throw errors
     */
    function List() {
        var that = this;

        /**
         * Internal Array for storing the (hash) values
         * @private
         * @attribute list
         * @type {Array}
         */
        that.list = [];

        /**
         * <code>listObject</code> will handle the mappings of the values and hashes
         *
         * @private
         * @attribute listObject
         * @type {ListObject}
         */
        that.listObject = new ListObject();
    }

    // inherit from base class AbstractCollection
    List.prototype = new AbstractCollection();
    List.prototype.constructor = List;

    /**
     * Appends an element at the end of the list
     *
     * @public
     * @method add
     * @param  {Object} element element to be appended to the list
     * @return {Boolean}        true if the element was appended
     * @example
     *     var myListCollection = new List();
     *     myListCollection.add( {'foo': 25, 'bar': 'Hello'} );
     *     myListCollection.add( [1, 2, 'three'] );
     */
    List.prototype.add = function( element ) {
        // only append the element if it's actually an element
        if( element !== undefined ) {
            // if the element is an Object or Array, we need to build
            // a hash for faster lookups
            if( this.needsHashing( element ) ) {
                var objectHash = this.getHash( element );

                // if the hash is already stored in the Array,
                // only increment the internal counter, DO NOT push
                // the object hash to the Array!
                if( this.listObject.contains( objectHash ) ) {
                    // console.warn( this.listObject.listObject );
                    // console.warn( '1', objectHash );
                    this.listObject.add( element );
                } else {
                    // converting the element to a hash and add this
                    // hash value. so we can lookup faster (no addition iterating)
                    this.list.push( this.listObject.add( element ) );
                }

                return true;
            } else if( element.constructor === Function ) {
                // no function handling yet
                return null;
            } else {
                this.list.push( element );
                return true;
            }
        }

        return null;
    };

    /**
     * Insert the given element at the specified position in the the list
     *
     * @public
     * @method addAt
     * @param  {Object} element the specified element to insert
     * @param  {Number} index   Index at which the specified element is to be inserted, must be greater than -1
     * @return {Boolean}        true if the element was inserted
     * @example
     *     var myListCollection = new List();
     *     myListCollection.addAt( 'foo', 2 );
     *     myListCollection.addAt( {foo: 'Hello', 'bar': 'World'} );
     */
    List.prototype.addAt = function( element, index ) {
        /**
         * general note: all elements that aren't a String will be
         * hashed and stored in the internal baseObject. the hash value
         * in particular will be stored in the actual Array
         */

        // we need one valid element at least
        if( element === undefined ) {
            return null;
        }

        var listLength = this.size();

        // if an index is set, try to insert the element on the
        // index position
        if( index !== undefined && index.constructor === Number && index > -1 ) {
            // firstly, check if that element is already present in the Array
            if( this.needsHashing( element ) ) {
                // if that element is present
                if( this.listObject.contains( this.getHash( element ) ) ) {
                    // only increment the duplicate counter,
                    // do not add the element to the Array list
                    this.listObject.add( element );

                    return true;
                }
            }

            if( index === 0 ) {
                // first position -> do an unshift operation
                if( this.needsHashing( element ) ) {
                    this.list.unshift( this.listObject.add( element ) );
                } else {
                    this.list.unshift( element );
                }

                return true;
            } else if( index > 0 && index < (listLength - 1) ) {
                // in the middle of the array
                if( this.needsHashing( element ) ) {
                    this.list.splice( index, 0, this.listObject.add( element ) );
                } else {
                    this.list.splice( index, 0, element );
                }

                return true;
            } else if( index >= (listLength - 1) ) {
                // index is higher or equal the array length
                if( this.needsHashing( element ) ) {
                    this.list.push( this.listObject.add( element ) );
                } else {
                    this.list.push( element );
                }
                return true;
            }
        } else {
            // no index was given, simply push the element to the ned
            if( this.needsHashing( element ) ) {
                this.list.push( this.listObject.add( element ) );
            } else {
                this.list.push( element );
            }
            return true;
        }
    };

    /**
     * Returns the element at the specified position, does not delete the element
     * from the original list
     *
     * @todo think about a collision, when an Object hash equals a normal String
     * @public
     * @method get
     * @param  {Number} index the elements position in the list
     * @return {Object}       the object from the list, or null if something's wrong
     * @example
     *     var myListCollection = new List();
     *     myListCollection.get( 0 ); // get first element
     *     myListCollection.get( 2 ); // get third element
     */
    List.prototype.get = function( index ) {
        if( index === undefined ) {
            return null;
        }

        // check that the given index is in the bounds of our Array
        if( index >= 0 && (index < this.list.length) ) {
            // check if the requested entry is probably a hashed
            // object entry
            if( this.listObject.contains( this.list[index] ) ) {
                // if there's an entry, return the reference
                return this.listObject.get( this.list[index] ).ref;
            }

            return this.list[index];
        }

        // index not specified or out of bounds
        return null;
    };

    /**
     * Remove all elements from the List
     *
     * @public
     * @method clear
     * @example
     *     var myListCollection = new List();
     *     // adding elements before and so on ...
     *     myListCollection.clear(); // list will be reset
     */
    List.prototype.clear = function() {
        // don't create a new Array here like:
        //      this.list = [];
        // this would break all old references to this array
        this.list.length = 0;

        // reset the internal baseObject
        this.listObject.reset();
    };

    /**
     * Returns the number of elements the list is containing
     *
     * @public
     * @method size
     * @param {Boolean} includeDuplicates set to true, if you also want to count the duplicate entries
     * @return {Number} element count
     * @example
     *     var myListCollection = new List();
     *     myListCollection.add( 'foo' );
     *     myListCollection.size(); // "1"
     *
     *     // duplicate handling
     *     myListCollection.add( [1, 2, 3] );
     *     myListCollection.size();           // "2" (remember: we've added 'foo' before)
     *     myListCollection.add( [1, 2, 3] ); // adding the SAME object again
     *     myListCollection.size();           // still "2", duplicate added
     *     myListCollection.size( true );     // "3", flag to count duplicates is set
     */
    List.prototype.size = function( includeDuplicates ) {
        if( includeDuplicates ) {
            return this.list.length + this.listObject.getDuplicateCount();
        } else {
            return this.list.length;
        }
    };

    /**
     * Get the index position of the specified element
     *
     * @public
     * @method indexOf
     * @param  {Object} element the element to get the index of
     * @return {Number}         index position, -1 if not present
     * @example
     *     var myListCollection = new List();
     *     myListCollection.add( 'foo' );
     *     myListCollection.add( {'foo': 1, 'bar': 2} );
     *
     *     myListCollection.indexOf( 'foo' );                // 0
     *     myListCollection.indexOf( {'foo': 1, 'bar': 2} ); // 1
     */
    List.prototype.indexOf = function( element ) {
        if( element !== undefined ) {
            if( this.needsHashing( element ) ) {
                // "sort" the object keys here, if though objects do not
                // really have a guaranteed order
                if( element.constructor === Object ) {
                    element = this.sortObjectByKeys( element );
                }

                // because List internally maintains an Array, we need
                // to hash every Object that isn't a String
                // check if the hash value of the element is in the list
                return this.list.indexOf( this.getHash( element ) );
            } else {
                // Strings can be searched directly
                return this.list.indexOf( element );
            }
        }

        return -1;
    };

    /**
     * Checks, if the specified element is in the list
     *
     * @public
     * @method contains
     * @param  {Object} element the element to look up to
     * @return {Boolean}        true, if the element was found in the list
     * @example
     *     var myListCollection = new List();
     *     myListCollection.add( 'foo' );
     *     myListCollection.add( {'foo': 1, 'bar': 2} );
     *
     *     myListCollection.contains( 'foo' );                // true
     *     myListCollection.contains( 84 );                   // false
     *     myListCollection.contains( {'foo': 1, 'bar': 2} ); // true
     */
    List.prototype.contains = function( element ) {
        if( element !== undefined ) {
            // indexOf will return a value larger than -1 if the
            // specified element is in the list
            return this.indexOf( element ) > -1;
        }

        return null;
    };

    /**
     * Test if the list contains elements
     *
     * @public
     * @method isEmpty
     * @return {Boolean} true, if the list is empty
     * @example
     *     var myListCollection = new List();
     *     myListCollection.isEmpty(); // true
     */
    List.prototype.isEmpty = function() {
        // if the list is empty, the length is 0
        return this.list.length === 0;
    };

    /**
     * Removes specified element from the list (the FIRST one found). When one object
     * is stored multiple times, only the internal counter for this object
     * will be decremented until 0, then the object itself will also be deleted.
     *
     * @public
     * @method remove
     * @param  {Object}  element the element to remove
     * @param  {Boolean} all     if true, all (indentically) added Objects will be removed
     * @return {Boolean} true, if object found and removed
     * @example
     *     var myListCollection = new List();
     *     myListCollection.add( [1, 2, 3, 'four'] );
     *     myListCollection.remove( [1, 2, 3, 'four'] ); // true
     *     myListCollection.remove( 84 );                // false
     */
    List.prototype.remove = function( element, all ) {
        if( element === undefined ) {
            return false;
        }

        if( this.needsHashing( element ) ) {
            // 1st: create the hash and check the position in the Array list
            var hash = this.getHash( element ),
                indexPositionObject = this.indexOf( hash );

            // element not in the list?
            if( indexPositionObject < 0 ) {
                return false;
            }

            // 2nd: remove the hash entry vom this.baseObject
            if( this.listObject.getObjectCount( hash ) < 2  || all ) {
                // if the object is stored only one time, or the
                // flag to delete all object is set, delete the object(s)
                this.listObject.delete( hash );

                // 3rd: remove the hash from the Array list
                if( this.list.splice( indexPositionObject, 1 ).length === 1 ) {
                    return true;
                }
            } else {
                // the object is stored multiple times, only increment
                // the internal counter and the duplicate counter
                this.listObject.remove( hash );

                return true;
            }
        } else {
            var indexPositionElement = this.indexOf( element );

            // when the element is not in the list, return false
            if( indexPositionElement < 0 ) {
                return false;
            }

            // else remove from the Array list
            if( this.list.splice( indexPositionElement, 1 ).length === 1 ) {
                return true;
            }
        }

        return false;
    };

    /**
     * Replaces the element at the given position with the specified element
     *
     * @method set
     * @public
     * @param  {Number} index   the index position where the element is located in the list
     * @param  {Object} element the new element to replace the old with
     * @return {Objeect}        the replaced element or null if replacement failed
     */
    List.prototype.set = function( element, index ) {
        var oldElement;

        // everything defined?
        if( element === undefined || index === undefined ) {
            return null;
        }

        // index out of bounds?
        if( index < 0 || index >= this.size() ) {
            return null;
        }

        // check if the old element on the index position is a
        // hashed object
        if( this.listObject.get( this.list[index] ) !== null ) {
            oldElement = this.listObject.get( this.list[index] ).ref;

            // if the new element is a String, we have to delete the old entry
            // from the listObject and set the new element in the list simply
            if( element.constructor === String ) {
                this.list[index] = element;
            } else {
                // the old element and the new one are non String objects
                this.list[index] = this.listObject.replace( this.list[index], element );
            }

            // console.warn( oldElement );
            // console.warn( element, 'the element with the index is already a hashed object' );
        } else {
            // the element on the index position is not a hashed object

            // if the new element is also a String, we can swap simply
            if( element.constructor === String ) {
                oldElement = this.list[index]; // cache the old element for return

                // set the new element on the index position of the old one
                this.list[index] = element;
            } else {
                // the new element is not a String, but the old one is
                oldElement = this.list[index];

                // replace the object hash with the old String in the list
                this.list[index] = this.listObject.add( element );
            }
        }

        return oldElement;
    };

    /**
     * Simple String representation of the internal Array list
     *
     * @public
     * @method toString
     * @return {String} Stringifyed Array list
     */
    List.prototype.toString = function() {
        return this.list.toString();
    };

    return List;
} );
