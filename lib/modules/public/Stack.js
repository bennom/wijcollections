/*
 * wijcollections - Stack
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define( "wijcModules/public/Stack", ['wijcModules/private/AbstractCollection', 'wijcModules/private/ListObject'], function( AbstractCollection, ListObject ) {
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
        that.stack = [];
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

    return Stack;
} );
