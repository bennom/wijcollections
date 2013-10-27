/*
 * wijcollections - ListObject
 * https://github.com/webinfluenza/wijcollections
 *
 * Copyright (c) 2013 Benno Mielke
 * Licensed under the MIT license.
 */

define("wijcModules/private/ListObject",["wijcModules/private/AbstractCollection"],function(e){function t(){var e=this;e.reset()}return t.prototype=new e,t.constructor=t,t.prototype.reset=function(){this.listObject={overallCnt:0,duplicateCnt:0}},t.prototype.add=function(e){e.constructor===Object&&(e=this.sortObjectByKeys(e));var t=this.getHash(e);return this.listObject[t]===undefined?(this.listObject[t]={ref:e,cnt:1},this.listObject.overallCnt++):(this.listObject[t].cnt++,this.listObject.duplicateCnt++),t},t.prototype.contains=function(e){return this.listObject[e]!==undefined},t.prototype.get=function(e){return this.contains(e)?this.listObject[e]:null},t.prototype.getDuplicateCount=function(){return this.listObject.duplicateCnt},t.prototype.getObjectCount=function(e){return this.listObject[e].cnt},t.prototype.delete=function(e){delete this.listObject[e],this.listObject.overallCnt--},t.prototype.remove=function(e){this.getObjectCount(e)>1?(this.listObject[e].cnt--,this.listObject.duplicateCnt--):this.delete(e)},t}),define("modules/private/ListObject",function(){});