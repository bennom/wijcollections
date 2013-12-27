/**
 * <h2><strong>Do not instanciate this one ever!</strong></h2>
 * Basic, abstract Class.
 *
 * @class AbstractCollection
 * @constructor
 */
function AbstractCollection() {
    var MAX_ARRAY_LENGTH = Math.floor( (Math.pow( 2, 32 ) - 1) / 2 ),
        that = this;

    /**
     * Returns the maximum array length for the collections API.
     *
     * @protected
     * @method getMaxArrayLength
     * @return {Number} the maximum Array length
     */
    that.getMaxArrayLength = function() {
        return MAX_ARRAY_LENGTH;
    };

    /**
     * Using the Java hashCode function to generate a Integer hash code.
     *
     * @protected
     * @see http://stackoverflow.com/a/7616484
     * @method hashCode
     * @param  {String} str String representation of any object
     * @return {String}     hash code
     */
    that.hashCode = function( str ) {
        var hashValue = 0, len = str.length;

        if( len === 0 ) {
            return hashValue;
        }

        for( var i = 0; i < len; i++ ) {
            hashValue = ( (hashValue << 5) - hashValue ) + str.charCodeAt( i );
            hashValue = hashValue & hashValue; // Convert to 32bit integer
        }

        // convert Number to String here, because we're using the hash code
        // as a Object key
        return hashValue;
    };

    /**
     * Applies a supplemental hash function to a given hashCode, which defends against
     * poor quality hash functions. This is critical because HashMap uses power-of-two
     * length hash tables, that otherwise encounter collisions for hashCodes that do not
     * differ in lower bits.
     *
     * @protected
     * @see http://www.docjar.com/docs/api/java/util/HashMap.html#hash(int)
     * @method hash
     * @param  {Number} h The hash code
     * @return {String}   String respresentation of the calculates hash code
     */
    this.hash = function( h ) {
        // This function ensures that hashCodes that differ only by
        // constant multiples at each bit position have a bounded
        // number of collisions (approximately 8 at default load factor).
        h ^= (h >>> 20) ^ (h >>> 12);
        return h ^ (h >>> 7) ^ (h >>> 4);
    };

    /**
     * Check if a given number is a floating point number
     * @param  {Number} number the number to check
     * @return {Boolean}       true, if the specified number is a floating point number, else false
     */
    that.isFloat = function( number ) {
        if( number === undefined ) {
            return false;
        }

        if( number.constructor !== Number ) {
            return false;
        }

        return number === +number && number !== (number|0);
    };

    /**
     * Internal function for sorting a object by key (if needed) and
     * returning a valid hash value, if the specified object
     * needs a hashing
     *
     * @protected
     * @method hashObject
     * @param  {Object} obj the specified object that'll be processed
     * @return {Object}     a hash string if hashing is needed, else the object itself
     */
    that.hashObject = function( obj ) {
        if( obj.constructor === Object ) {
            // pseudo sorting
            obj = that.sortObjectByKeys( obj );
        }

        if( that.needsHashing( obj ) ) {
            obj = that.getHash( obj );
        }

        return obj;
    };

    return true;
}

AbstractCollection.prototype.constructor = AbstractCollection;

/**
 * Public API definition
 */

/**
 * Central function to check if an given element needs to be processed
 * with hashing (like Object, Array) or not (e.g. String)
 *
 * @public
 * @method needsHashing
 * @param  {Object} element the element to check
 * @return {Boolean}        true, if element needs hashing
 */
AbstractCollection.prototype.needsHashing = function( element ) {
    if( element === undefined ) {
        return null;
    }

    if( this.isFloat( element ) ) {
        return true;
    }

    var elementType = element.constructor;

    if( elementType === String || elementType === Number || elementType === Boolean || elementType === Function ) {
        return false;
    } else {
        return true;
    }
};

/**
 * Create a Hash of a given String
 *
 * @public
 * @method getHash
 * @param  {String} str the String to build a hash on
 * @return {String}     the actual hash value, <code>null</code> if parameter is missing or a Function
 */
AbstractCollection.prototype.getHash = function( obj ) {
    if( obj !== undefined && obj !== null ) {
        // No hash for functions :(
        if( obj.constructor === Function ) {
            return null;
        }

        // we need a String for hashing
        // returning string as the hash is used for indexing in an object
        if( obj.constructor !== String ) {
            return this.hash( this.hashCode( JSON.stringify( obj ) ) ) + '';
        } else {
            return this.hash( this.hashCode( obj ) ) + '';
        }
    }

    // and we need a parameter at least :-/
    return null;
};

/**
 * Sort the keys in an object by it's keys. Although objects do not
 * have a guaranteed key order, this function will help to identify
 * when two objects are "equal".
 *
 * @public
 * @method sortObjectByKeys
 * @param  {Object} obj the object to sort the keys
 * @return {Object}     sorted object (a copy of the specified one)
 */
AbstractCollection.prototype.sortObjectByKeys = function( obj ) {
    if( obj !== undefined && obj.constructor === Object ) {
        var objKeys = [],
            sortedObject = {};

        // grab all keys here
        for( var key in obj ) {
            if( obj.hasOwnProperty( key ) ) {
                objKeys.push( key );
            }
        }

        // using Array.sort() will ensurce an sorted array
        objKeys.sort();

        // "reimplement" the keys
        for( var i = 0, iMax = objKeys.length; i < iMax; i++ ) {
            sortedObject[objKeys[i]] = obj[objKeys[i]];
        }

        return sortedObject;
    }

    return null;
};

/**
 * Clone Objects, Arrays or date objects
 *
 * @public
 * @method cloneObject
 * @param  {Object} original the element to copy
 * @return {Object}          the copied element
 */
AbstractCollection.prototype.cloneObject = function( original ) {
    var copy;

    if( original === undefined ) {
        return null;
    }

    if( original.constructor === Array ) {
        copy = [];

        for( var a = 0, aMax = original.length; a < aMax; a++ ) {
            copy[a] = original[a];
        }
    }

    if( original.constructor === Object ) {
        copy = {};

        for( var prop in original ) {
            // when the original object has the given property,
            // do some recursive cloning
            if( original.hasOwnProperty( prop ) ) {
                // if the value is another object, copy recursive
                if( original[prop].constructor === Object ) {
                    copy[prop] = this.cloneObject( original[prop] );
                } else {
                    // else, if the the value is not an object, we can
                    // simply copy the value here
                    copy[prop] = original[prop];
                }
            }
        }
    }

    if( original.constructor === Date ) {
        copy = new Date();
        copy.setTime( original.getTime() );
    }

    return copy || null;
};

/**
 * This class will manage the objects of the List class implementation.
 * Because Objects can't have the same key name multiple times, the
 * counter variables take effect. Furthermore this will save memory
 * on larger objects.
 *
 * @constructor
 * @class ListObject
 * @extends {AbstractCollection}
 * @todo provide method for getting all keys
 */
function ListObject() {
    var that = this;

    /**
     * Reset the internal list object
     *
     * @protected
     * @method resetListObject
     */
    that.resetListObject = function() {
        this.listObject = {
            overallCnt: 0,
            duplicateCnt: 0
        };
    };

    // the initial creation of our object
    that.resetListObject();
}

// inherit from AbstractCollection for some basic functinalites
ListObject.prototype = new AbstractCollection();
ListObject.constructor = ListObject;

/**
 * Creates or resets the interal mapping object
 *
 * @method reset
 * @public
 */
ListObject.prototype.reset = function() {
    this.resetListObject();
};

/**
 * Every object that is not a String, Boolean or Number wil be converted
 * to a hash internally.
 *
 * @public
 * @method add
 * @param  {Object} element The object to add and map
 * @param  {String} hash    Optional hash string used for object key (only for a internal purpose!)
 * @return {String}         The objects Hash String
 */
ListObject.prototype.add = function( element, hash ) {
    var objectHash;

    // sort the objects keys, so we can identify when the hash
    // of the object is already stored (duplication)
    if( element.constructor === Object ) {
        element = this.sortObjectByKeys( element );
    }

    if( hash !== undefined && hash.constructor === String ) {
        objectHash = hash;
    } else {
        objectHash = hash || this.needsHashing( element ) ? this.getHash( element ) : element;
    }

    // map the object hash to the list position if not already
    // existent in the baseObject
    if( this.listObject[objectHash] === undefined ) {
        this.listObject[objectHash] = {
            'ref': element,
            'cnt': 1
        };

        this.listObject.overallCnt++;
    } else {
        // if that object is already in the list,
        // increment the counter only
        this.listObject[objectHash].cnt++;
        this.listObject.duplicateCnt++;
    }

    return objectHash;
};

/**
 * Checks, if the speficied hash value (for an object) is in the list.
 * @param  {String} hash the hash value of an object to look for
 * @return {Boolean}     true, if there's an object with the specified hash
 */
ListObject.prototype.contains = function( hash ) {
    return this.listObject[hash] !== undefined;
};

/**
 * Returns a reference of the baseObj from a specified hash
 *
 * @public
 * @method getInteralObject
 * @param  {String} hash the hash value of the specified element
 * @return {Object}      the object reference
 */
ListObject.prototype.get = function( hash ) {
    // if the there's an object stored in the list with the
    // specified hash, return that reference
    if( this.contains( hash ) ) {
        return this.listObject[hash];
    }

    return null;
};

/**
 * Get the duplicate counter of the whole List
 *
 * @public
 * @method getDuplicateCount
 * @return {Number} duplicate counter
 */
ListObject.prototype.getDuplicateCount = function() {
    return this.listObject.duplicateCnt;
};

/**
 * Get the object counter (incl. duplicates)
 *
 * @public
 * @method getObjectCount
 * @param  {String} hash a string specifying the object
 * @return {Number}      object counter
 */
ListObject.prototype.getObjectCount = function( hash ) {
    return this.listObject[hash].cnt;
};

/**
 * This method will remove an object **without duplicate
 * checking**
 *
 * @public
 * @method delete
 * @param  {String} hash a hash string identifying the object to remove completely
 */
ListObject.prototype.delete = function( hash ) {
    // delete the whole object and increment the overall counter
    // of elements stored
    delete this.listObject[hash];
    this.listObject.overallCnt--;
};

/**
 * Removes an object, but **also performs a duplicate check**
 *
 * @public
 * @method remove
 * @param  {String} hash a hash string identifying the object to remove,
 *                       or remove one duplicate entry
 */
ListObject.prototype.remove = function( hash ) {
    // if an object is stored multiple times, only
    // decrement the counter for duplicates and the
    // counter of this object in particular
    if( this.getObjectCount( hash ) > 1 ) {
        this.listObject[hash].cnt--;
        this.listObject.duplicateCnt--;
    } else {
        // if only one object is left, remove the whole
        // object
        this.delete( hash );
    }
};

/**
 * Replacing an (old) object with a new one
 *
 * @public
 * @method replace
 * @param  {String}  oldHash   hash code that identifies the old element
 * @param  {Object}  element   new element to add
 * @param  {Boolean} isOldHash if true, the old element hash will be used as new hash again
 * @return {String}            hash code of the new element
 */
ListObject.prototype.replace = function( oldHash, element, isOldHash ) {
    // 1st: check duplicate counter
    var oldEntryDuplicateCounter = this.listObject[oldHash].cnt;

    // 2nd: subtract the duplicate counter of this object from the
    //      overall counter (if there are duplicates)
    if( oldEntryDuplicateCounter > 1 ) {
        this.listObject.duplicateCnt -= oldEntryDuplicateCounter - 1;
    }

    // 3rd: if the new element is an object, "sort" the keys
    if( element.constructor === Object ) {
        element = this.sortObjectByKeys( element );
    }

    // 4th: delete the old object entry
    this.delete( oldHash );

    // add the new element
    // use old element hash again if the flag was set (e.g. like HashMap class)
    return this.add( element, isOldHash ? oldHash : undefined );
};

/**
 * Stack Collection constructor, inheriting from AbstractCollection Class.
 *
 * @constructor
 * @class Stack
 * @extends {AbstractCollection}
 * @implements {ListObject}
 * @todo throw errors
 */
function Stack() {
    var that = this;

    /**
     * Internal Array that will store the (hash) values
     *
     * @private
     * @attribute stack
     * @type {Array}
     */
    that.stack = [];

    /**
     * The <code>stackObject</code> will handle the mappings between hash values
     * and values.
     *
     * @private
     * @attribute stackObject
     * @type {ListObject}
     */
    that.stackObject = new ListObject();
}

// inherit from base class AbstractCollection
Stack.prototype = new AbstractCollection();
Stack.prototype.constructor = Stack;

/**
 * Check, if there's any element in the stack
 *
 * @public
 * @method empty
 * @return {Boolean} true, if the Stack is empty
 */
Stack.prototype.empty = function() {
    return this.stack.length === 0;
};

/**
 * Looks at the object at the top of the stack. Does not remove the element
 * from the stack (just a copy)
 *
 * @public
 * @method peek
 * @return {Object} Copy of the top element of the stack
 */
Stack.prototype.peek = function() {
    var size = this.stack.length,
        hashedObject = this.stackObject.get( this.stack[size - 1] ),
        peekObject;

    // reads the last element from stack
    if( size < 1 ) {
        return null;
    }

    // check if the last element is a hashed object
    // if so, return a copy the internal hash object
    if( hashedObject !== null ) {
        peekObject = this.cloneObject( hashedObject.ref );
    } else {
        // if it's not a hased object, return a copy of the
        // last inserted element of the stack
        peekObject = this.stack[size - 1];
    }

    return peekObject;
};

/**
 * Returns the topmost object of the stack **and removes** this element.
 *
 * @public
 * @method pop
 * @return {Object} The object at the top of the stack
 */
Stack.prototype.pop = function() {
    // grab the latest object, no matter if it's a copy or not,
    // because we're deleting the old (reference) in a jiffy
    var popObject = this.peek(),
        size = this.stack.length;

    if( size < 1 ) {
        return null;
    }

    // remove from interal Object
    if( this.stackObject.get( this.stack[size - 1] ) !== null ) {
        this.stackObject.remove( this.stack[size - 1] );
    }

    // remove that topmost element from Array Stack
    this.stack = this.stack.slice( 0, -1 );

    return popObject;
};

/**
 * Pushes element onto the top of the stack
 *
 * @public
 * @method push
 * @param  {Object} item the element to push
 * @return {Object}      the pushed element, null if failed
 */
Stack.prototype.push = function( item ) {
    if( item === undefined ) {
        return null;
    }

    // do we need to hash the item?
    if( this.needsHashing( item ) ) {
        // push returned hash
        this.stack.push( this.stackObject.add( item ) );
    } else {
        // push item directly
        this.stack.push( item );
    }

    return item;
};

/**
 * (1-based) Returns the position of given element. This will be the distance
 * from the top of the stack (or the nearest position on duplicate). The topmost
 * item will get the number. **This method uses Array.prototype.lastIndexOf. If
 * you have to, include the Polyfill module to support older browsers.**
 *
 * @public
 * @method search
 * @param  {Object} element the element to search
 * @return {Number}         1-based position from top of the stack, -1 if nothing found
 */
Stack.prototype.search = function( element ) {
    var stackPosition = -1;

    // noargh ... we need an element :-/
    if( element === undefined ) {
        return null;
    }

    if( this.needsHashing( element) ) {
        // we need the hash value of the element first, then
        // check the position
        stackPosition = this.stack.lastIndexOf( this.getHash( element ) );
    } else {
        stackPosition = this.stack.lastIndexOf( element );
    }

    return stackPosition > -1 ? (this.stack.length - stackPosition) : -1;
};

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

/**
 * HashMap constructor, inheriting from AbstractCollection Class.
 *
 * @constructor
 * @class HashMap
 * @extends {AbstractCollection}
 * @implements {ListObject}
 * @todo throw errors, implement entrySet()
 */
function HashMap() {
    var that = this;

    /**
     * Array that'll store the original keys
     *
     * @private
     * @attribute keyList
     * @type {Array}
     */
    that.keyList = [];

    /**
     * Stores the mappings of the hash values for the keys to the values
     *
     * @private
     * @attribute keyHashToValueHash
     * @type {Object}
     */
    this.keyHashToValueHash = {};

    /**
     * Stores the value hash to the key hash strings. Using Object here,
     * because object lookups are faster than Array.indexOf() in general.
     *
     * @private
     * @attribute valueHashToKeyHash
     * @type {Object}
     */
    this.valueHashToKeyHash = {};

    /**
     * Maps the hash values of the keys to the original keys
     *
     * @private
     * @attribute keyHashToKey
     * @type {Object}
     */
    this.keyHashToKey = {}; // maps hash of keys to the orginal keys

    /**
     * Stores the values with the key in a ListObject. The key will be converted
     * in a hash string if needed.
     *
     * @private
     * @attribute valueList
     * @type {ListObject}
     */
    that.valueList = new ListObject();

    /**
     * Resetting the internal data objects and variables.
     *
     * @protected
     * @method resetHashMap
     */
    that.resetHashMap = function() {
        // reset all the things!
        that.keyList.length = 0;
        that.keyHashToValueHash = {};
        that.keyHashToKey = {};
        that.valueList.reset();

    };

    that.resetHashMap(); // fire it up here
}

HashMap.prototype = new AbstractCollection();
HashMap.prototype.constructor = HashMap;

/**
 * Removes all of the mappings from this map.
 *
 * @public
 * @method clear
 */
HashMap.prototype.clear = function() {
    this.resetHashMap();
};

/**
 * Returns a copy of the <code>HashMap</code>.
 *
 * @public
 * @method clone
 * @return {HashMap} a copy of the actual <code>HashMap</code>
 */
HashMap.prototype.clone = function() {
    // create an empty, new HashMap
    var copy = new HashMap();

    // copy all things ... in the new HashMap
    copy.putAll( this );

    // and return the new HashMap
    return copy;
};

/**
 * Returns <code>true</code> if this map contains a mapping for the specified <code>key</code>.
 *
 * @public
 * @method containsKey
 * @param  {Object} key the key to look for
 * @return {Boolean}    <code>true</code>, if the key exists, else <code>false</code>
 */
HashMap.prototype.containsKey = function( key ) {
    // if the specified key isn't present, we can't return
    // anything
    if( key === undefined ) {
        return false;
    }

    // convert the key to a hash string if necessary
    key = this.hashObject( key );

    // check if the key is stored in the key list
    return this.keyHashToKey[key] !== undefined;
};

/**
 * Returns true if this map maps one or more keys to the specified value.
 *
 * @public
 * @method containsValue
 * @param  {Object} value the value to look for
 * @return {Boolean}      <code>true</code>, if the value exists, else <code>false</code>
 */
HashMap.prototype.containsValue = function( value ) {
    if( value === undefined ) {
        return false;
    }

    var valueHash = this.hashObject( value );

    return this.valueHashToKeyHash[valueHash] !== undefined;
};

/**
 * Returns the value to which the specified key is mapped, or
 * <code>null</code> if this map contains no mapping for the key.
 *
 * @public
 * @method get
 * @param  {Object} key the key of the value that will be returned
 * @return {Object}     the mapped <code>value</code> to the key, or <code>null</code>
 *                          if the key isn't present
 */
HashMap.prototype.get = function( key ) {
    if( this.containsKey( key ) === false ) {
        return null;
    }

    key = this.hashObject( key );

    // use the inherit get method from ListObject class to get the element
    return this.valueList.get( key ).ref;
};

/**
 * Checks, if there an existing key-value mapping.
 *
 * @public
 * @method isEmpty
 * @return {Boolean} <code>true</code>, if no key value mapping exists, else <code>false</code>
 */
HashMap.prototype.isEmpty = function() {
    return this.keyList.length === 0;
};

/**
 * Returns an Array of the keys contained in this map.
 *
 * @public
 * @method keySet
 * @return {Array} Empty <code>Array</code>, if no key exists, else an <code>Array</code> with all keys
 */
HashMap.prototype.keySet = function() {
    return this.keyList;
};

/**
 * Associate a specific value with a specific key.
 *
 * @public
 * @method put
 * @param  {Object} key   the key the value will be associated with
 * @param  {Object} value a value that will be associated with the key
 * @return {Object}       <code>null</code>, if the key isn't present yet, else the old stored
 *                        <code>value</code> of the key will be returned
 * @example
 *     var hm = new HashMap();
 *     hm.put( 'myKey', {'foo': new Date( 1984, 1, 15 )} ); // String as key with an Date object as value, returns null
 *     hm.put( {'bar': 1}, [1, 2, 3] ); // Object as key with Array as value, returns null
 *     hm.put( {'bar': 1}, 'Quux' ); // existing key with new value, the old value [1, 2, 3] will be returned
 */
HashMap.prototype.put = function( key, value ) {
    // if anything is not defined, we need to return
    if( key === undefined || value === undefined || key === null ) {
        return null;
    }

    // pseudo-sort for keys that are objects actually
    if( key.constructor === Object ) {
        key = this.sortObjectByKeys( key );
    }

    // building the hash values (if needed) we need for the store process
    var keyHash = this.hashObject( key ),
        valueHash = this.hashObject( value );

    // the key is already present in our list
    if( this.keyHashToKey[keyHash] !== undefined ) {
        // get the old value (returning this later) and the hash value
        var oldValue = this.valueList.get( keyHash ).ref,
            oldValueHash = this.hashObject( oldValue );

        // replace the old value with the new one
        this.valueList.replace( keyHash, value, true );

        // update internal mappings
        this.keyHashToValueHash[keyHash] = valueHash;
        this.valueHashToKeyHash[valueHash] = keyHash;

        // remove the old value hash from the mapping
        delete this.valueHashToKeyHash[oldValueHash];

        // return the old value
        return oldValue;
    }

    // add the original key to the key array
    this.keyList.push( key );

    // add the original value to the interal ListObject instance
    this.valueList.add( value, keyHash );

    // map the keyHash to the valueHash
    this.keyHashToValueHash[keyHash] = valueHash;

    // store the value hash
    this.valueHashToKeyHash[valueHash] = keyHash;

    // map the hashKey to the original key
    this.keyHashToKey[keyHash] = key;

    // if the element wasn't present yet, return null
    return null;
};

/**
 * Copies all of the mappings from the specified <code>map</code> to this map.
 *
 * @public
 * @method putAll
 * @param  {HashMap} hashMapObject mappings to be stored in this map
 * @return {Object}                <code>null</code> if hashMapObject is either
 *                                 undefined or not a HashMap
 */
HashMap.prototype.putAll = function( hashMapObject ) {
    if( hashMapObject === undefined || hashMapObject.constructor !== HashMap ) {
        return null;
    }

    var keySet = hashMapObject.keySet();

    for( var key in keySet ) {
        this.put( keySet[key], hashMapObject.get( keySet[key] ) );
    }
};

/**
 * Removes the mapping for a key from this map if it is present.
 *
 * @public
 * @method remove
 * @param  {Object} key key whose mapping is to be removed from the map
 * @return {Object}     previous <code>value</code> mapped the key, or <code>null</code> if
 *                      key was not found
 */
HashMap.prototype.remove = function( key ) {
    if( key === undefined ) {
        return null;
    }

    key = this.hashObject( key );

    // if the key in the map?
    if( this.keyHashToKey[key] === undefined ) {
        return null;
    }

    // get the old value
    var oldValue = this.valueList.get( key ).ref,
        oldValueHash = this.hashObject( oldValue );

    // remove all the mappings
    delete this.keyHashToKey[key];
    delete this.keyHashToValueHash[key];
    delete this.valueHashToKeyHash[oldValueHash];
    this.valueList.delete( key );

    // iterate over the keyList Array
    for( var i = 0, iMax = this.keyList.length; i < iMax; i++ ) {
        // because the keyList Array stores the keys in their original
        // structure (not hashed), we have to comapre the hash values
        // for each entry to look for the key we want to delete
        var actualKey = this.hashObject( this.keyList[i] );

        if( key === actualKey ) {
            // remove the key from the list
            this.keyList.splice( i, 1 );

            // return the old value for that key
            return oldValue;
        }
    }

    // something went wrong here :-/
    return null;
};

/**
 * Returns the number of key-value mappings in this map
 *
 * @public
 * @method size
 * @return {Number} the number of key-value mappings in this map, <code>AbstractCollection.MAX_ARRAY_LENGTH</code>
 *                      if map contains more elements than <code>AbstractCollection.MAX_ARRAY_LENGTH</code>
 */
HashMap.prototype.size = function() {
    if( this.keyList.length >= this.getMaxArrayLength() ) {
        return this.getMaxArrayLength();
    }

    return this.keyList.length;
};

/**
 * Returns an Array view of the values contained in this <code>HashMap</code>
 *
 * @public
 * @method values
 * @return {Array} empty <code>Array</code> if no value exists, else an <code>Array</code> with the values
 */
HashMap.prototype.values = function() {
    var valueList = [];

    // iterate over the list object's keys
    for( var key in this.valueList.listObject ) {
        // store the value behind the key (if there's one)
        var value = this.valueList.get( key ).ref;

        if( value !== undefined ) {
            // if there's a valid value ...
            valueList.push( value );
        }
    }

    // return all values, or an empty Array
    return valueList;
};
