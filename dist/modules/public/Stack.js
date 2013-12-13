/*
 * wijcollections - Stack
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/public/Stack",["wijcModules/private/AbstractCollection","wijcModules/private/ListObject"],function(e,t){function n(){var e=this;e.stack=[],e.stackObject=new t}return n.prototype=new e,n.prototype.constructor=n,n.prototype.empty=function(){return this.stack.length===0},n.prototype.peek=function(){var e=this.stack.length,t=this.stackObject.get(this.stack[e-1]),n;return e<1?null:(t!==null?n=this.cloneObject(t.ref):n=this.stack[e-1],n)},n.prototype.pop=function(){var e=this.peek(),t=this.stack.length;return t<1?null:(this.stackObject.get(this.stack[t-1])!==null&&this.stackObject.remove(this.stack[t-1]),this.stack=this.stack.slice(0,-1),e)},n.prototype.push=function(e){return e===undefined?null:(this.needsHashing(e)?this.stack.push(this.stackObject.add(e)):this.stack.push(e),e)},n.prototype.search=function(e){var t=-1;return e===undefined?null:(this.needsHashing(e)?t=this.stack.lastIndexOf(this.getHash(e)):t=this.stack.lastIndexOf(e),t>-1?this.stack.length-t:-1)},n}),define("modules/public/Stack",function(){});