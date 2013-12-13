/*
 * wijcollections - ListObject
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/private/ListObject",["wijcModules/private/AbstractCollection"],function(e){function t(){var e=this;e.reset()}return t.prototype=new e,t.constructor=t,t.prototype.reset=function(){this.listObject={overallCnt:0,duplicateCnt:0}},t.prototype.add=function(e,t){var n;return e.constructor===Object&&(e=this.sortObjectByKeys(e)),t!==undefined&&t.constructor===String?n=t:n=t||this.needsHashing(e)?this.getHash(e):e,this.listObject[n]===undefined?(this.listObject[n]={ref:e,cnt:1},this.listObject.overallCnt++):(this.listObject[n].cnt++,this.listObject.duplicateCnt++),n},t.prototype.contains=function(e){return this.listObject[e]!==undefined},t.prototype.get=function(e){return this.contains(e)?this.listObject[e]:null},t.prototype.getDuplicateCount=function(){return this.listObject.duplicateCnt},t.prototype.getObjectCount=function(e){return this.listObject[e].cnt},t.prototype.delete=function(e){delete this.listObject[e],this.listObject.overallCnt--},t.prototype.remove=function(e){this.getObjectCount(e)>1?(this.listObject[e].cnt--,this.listObject.duplicateCnt--):this.delete(e)},t.prototype.replace=function(e,t,n){var r=this.listObject[e].cnt;return r>1&&(this.listObject.duplicateCnt-=r-1),t.constructor===Object&&(t=this.sortObjectByKeys(t)),this.delete(e),this.add(t,n?e:undefined)},t}),define("modules/private/ListObject",function(){});