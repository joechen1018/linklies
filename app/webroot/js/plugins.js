//jquery-url-parser
//!function(factory){"function"==typeof define&&define.amd?define(factory):window.purl=factory()}(function(){function parseUri(url,strictMode){for(var str=decodeURI(url),res=parser[strictMode?"strict":"loose"].exec(str),uri={attr:{},param:{},seg:{}},i=14;i--;)uri.attr[key[i]]=res[i]||"";return uri.param.query=parseString(uri.attr.query),uri.param.fragment=parseString(uri.attr.fragment),uri.seg.path=uri.attr.path.replace(/^\/+|\/+$/g,"").split("/"),uri.seg.fragment=uri.attr.fragment.replace(/^\/+|\/+$/g,"").split("/"),uri.attr.base=uri.attr.host?(uri.attr.protocol?uri.attr.protocol+"://"+uri.attr.host:uri.attr.host)+(uri.attr.port?":"+uri.attr.port:""):"",uri}function getAttrName(elm){var tn=elm.tagName;return"undefined"!=typeof tn?tag2attr[tn.toLowerCase()]:tn}function promote(parent,key){if(0===parent[key].length)return parent[key]={};var t={};for(var i in parent[key])t[i]=parent[key][i];return parent[key]=t,t}function parse(parts,parent,key,val){var part=parts.shift();if(part){var obj=parent[key]=parent[key]||[];"]"==part?isArray(obj)?""!==val&&obj.push(val):"object"==typeof obj?obj[keys(obj).length]=val:obj=parent[key]=[parent[key],val]:~part.indexOf("]")?(part=part.substr(0,part.length-1),!isint.test(part)&&isArray(obj)&&(obj=promote(parent,key)),parse(parts,obj,part,val)):(!isint.test(part)&&isArray(obj)&&(obj=promote(parent,key)),parse(parts,obj,part,val))}else isArray(parent[key])?parent[key].push(val):parent[key]="object"==typeof parent[key]?val:"undefined"==typeof parent[key]?val:[parent[key],val]}function merge(parent,key,val){if(~key.indexOf("]")){var parts=key.split("[");parse(parts,parent,"base",val)}else{if(!isint.test(key)&&isArray(parent.base)){var t={};for(var k in parent.base)t[k]=parent.base[k];parent.base=t}""!==key&&set(parent.base,key,val)}return parent}function parseString(str){return reduce(String(str).split(/&|;/),function(ret,pair){try{pair=decodeURIComponent(pair.replace(/\+/g," "))}catch(e){}var eql=pair.indexOf("="),brace=lastBraceInKey(pair),key=pair.substr(0,brace||eql),val=pair.substr(brace||eql,pair.length);return val=val.substr(val.indexOf("=")+1,val.length),""===key&&(key=pair,val=""),merge(ret,key,val)},{base:{}}).base}function set(obj,key,val){var v=obj[key];"undefined"==typeof v?obj[key]=val:isArray(v)?v.push(val):obj[key]=[v,val]}function lastBraceInKey(str){for(var brace,c,len=str.length,i=0;len>i;++i)if(c=str[i],"]"==c&&(brace=!1),"["==c&&(brace=!0),"="==c&&!brace)return i}function reduce(obj,accumulator){for(var i=0,l=obj.length>>0,curr=arguments[2];l>i;)i in obj&&(curr=accumulator.call(void 0,curr,obj[i],i,obj)),++i;return curr}function isArray(vArg){return"[object Array]"===Object.prototype.toString.call(vArg)}function keys(obj){var key_array=[];for(var prop in obj)obj.hasOwnProperty(prop)&&key_array.push(prop);return key_array}function purl(url,strictMode){return 1===arguments.length&&url===!0&&(strictMode=!0,url=void 0),strictMode=strictMode||!1,url=url||window.location.toString(),{data:parseUri(url,strictMode),attr:function(attr){return attr=aliases[attr]||attr,"undefined"!=typeof attr?this.data.attr[attr]:this.data.attr},param:function(param){return"undefined"!=typeof param?this.data.param.query[param]:this.data.param.query},fparam:function(param){return"undefined"!=typeof param?this.data.param.fragment[param]:this.data.param.fragment},segment:function(seg){return"undefined"==typeof seg?this.data.seg.path:(seg=0>seg?this.data.seg.path.length+seg:seg-1,this.data.seg.path[seg])},fsegment:function(seg){return"undefined"==typeof seg?this.data.seg.fragment:(seg=0>seg?this.data.seg.fragment.length+seg:seg-1,this.data.seg.fragment[seg])}}}var tag2attr={a:"href",img:"src",form:"action",base:"href",script:"src",iframe:"src",link:"href"},key=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"],aliases={anchor:"fragment"},parser={strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/},isint=/^[0-9]+$/;return purl.jQuery=function($){null!=$&&($.fn.url=function(strictMode){var url="";return this.length&&(url=$(this).attr(getAttrName(this[0]))||""),purl(url,strictMode)},$.url=purl)},purl.jQuery(window.jQuery),purl});
(function(e){if(typeof define==="function"&&define.amd){define(e)}else{window.purl=e()}})(function(){function s(e,n){var i=decodeURI(e),s=r[n||false?"strict":"loose"].exec(i),o={attr:{},param:{},seg:{}},u=14;while(u--){o.attr[t[u]]=s[u]||""}o.param["query"]=l(o.attr["query"]);o.param["fragment"]=l(o.attr["fragment"]);o.seg["path"]=o.attr.path.replace(/^\/+|\/+$/g,"").split("/");o.seg["fragment"]=o.attr.fragment.replace(/^\/+|\/+$/g,"").split("/");o.attr["base"]=o.attr.host?(o.attr.protocol?o.attr.protocol+"://"+o.attr.host:o.attr.host)+(o.attr.port?":"+o.attr.port:""):"";return o}function o(t){var n=t.tagName;if(typeof n!=="undefined")return e[n.toLowerCase()];return n}function u(e,t){if(e[t].length===0)return e[t]={};var n={};for(var r in e[t])n[r]=e[t][r];e[t]=n;return n}function a(e,t,n,r){var s=e.shift();if(!s){if(d(t[n])){t[n].push(r)}else if("object"==typeof t[n]){t[n]=r}else if("undefined"==typeof t[n]){t[n]=r}else{t[n]=[t[n],r]}}else{var o=t[n]=t[n]||[];if("]"==s){if(d(o)){if(""!==r)o.push(r)}else if("object"==typeof o){o[v(o).length]=r}else{o=t[n]=[t[n],r]}}else if(~s.indexOf("]")){s=s.substr(0,s.length-1);if(!i.test(s)&&d(o))o=u(t,n);a(e,o,s,r)}else{if(!i.test(s)&&d(o))o=u(t,n);a(e,o,s,r)}}}function f(e,t,n){if(~t.indexOf("]")){var r=t.split("[");a(r,e,"base",n)}else{if(!i.test(t)&&d(e.base)){var s={};for(var o in e.base)s[o]=e.base[o];e.base=s}if(t!==""){c(e.base,t,n)}}return e}function l(e){return p(String(e).split(/&|;/),function(e,t){try{t=decodeURIComponent(t.replace(/\+/g," "))}catch(n){}var r=t.indexOf("="),i=h(t),s=t.substr(0,i||r),o=t.substr(i||r,t.length);o=o.substr(o.indexOf("=")+1,o.length);if(s===""){s=t;o=""}return f(e,s,o)},{base:{}}).base}function c(e,t,n){var r=e[t];if(typeof r==="undefined"){e[t]=n}else if(d(r)){r.push(n)}else{e[t]=[r,n]}}function h(e){var t=e.length,n,r;for(var i=0;i<t;++i){r=e[i];if("]"==r)n=false;if("["==r)n=true;if("="==r&&!n)return i}}function p(e,t){var n=0,r=e.length>>0,i=arguments[2];while(n<r){if(n in e)i=t.call(undefined,i,e[n],n,e);++n}return i}function d(e){return Object.prototype.toString.call(e)==="[object Array]"}function v(e){var t=[];for(var n in e){if(e.hasOwnProperty(n))t.push(n)}return t}function m(e,t){if(arguments.length===1&&e===true){t=true;e=undefined}t=t||false;e=e||window.location.toString();return{data:s(e,t),attr:function(e){e=n[e]||e;return typeof e!=="undefined"?this.data.attr[e]:this.data.attr},param:function(e){return typeof e!=="undefined"?this.data.param.query[e]:this.data.param.query},fparam:function(e){return typeof e!=="undefined"?this.data.param.fragment[e]:this.data.param.fragment},segment:function(e){if(typeof e==="undefined"){return this.data.seg.path}else{e=e<0?this.data.seg.path.length+e:e-1;return this.data.seg.path[e]}},fsegment:function(e){if(typeof e==="undefined"){return this.data.seg.fragment}else{e=e<0?this.data.seg.fragment.length+e:e-1;return this.data.seg.fragment[e]}}}}var e={a:"href",img:"src",form:"action",base:"href",script:"src",iframe:"src",link:"href",embed:"src",object:"data"},t=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"],n={anchor:"fragment"},r={strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/},i=/^[0-9]+$/;m.jQuery=function(e){if(e!=null){e.fn.url=function(t){var n="";if(this.length){n=e(this).attr(o(this[0]))||""}return m(n,t)};e.url=m}};m.jQuery(window.jQuery);return m});

//jquery cookie
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "));return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setTime(+l+f*864e5)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)===undefined){return false}e.cookie(t,"",e.extend({},n,{expires:-1}));return!e.cookie(t)}});

/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.9
 *
 * Requires: jQuery 1.2.2+
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));


/*!
  * jquery perfect scrollbar
*/

(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){var t={wheelSpeed:10,wheelPropagation:false,minScrollbarLength:null,useBothWheelAxes:false,useKeyboard:true,suppressScrollX:false,suppressScrollY:false,scrollXMarginOffset:0,scrollYMarginOffset:0};var n=function(){var e=0;return function(){var t=e;e+=1;return".perfect-scrollbar-"+t}}();e.fn.perfectScrollbar=function(r,i){return this.each(function(){var s=e.extend(true,{},t),o=e(this);if(typeof r==="object"){e.extend(true,s,r)}else{i=r}if(i==="update"){if(o.data("perfect-scrollbar-update")){o.data("perfect-scrollbar-update")()}return o}else if(i==="destroy"){if(o.data("perfect-scrollbar-destroy")){o.data("perfect-scrollbar-destroy")()}return o}if(o.data("perfect-scrollbar")){return o.data("perfect-scrollbar")}o.addClass("ps-container");var u=e("<div class='ps-scrollbar-x-rail'></div>").appendTo(o),a=e("<div class='ps-scrollbar-y-rail'></div>").appendTo(o),f=e("<div class='ps-scrollbar-x'></div>").appendTo(u),l=e("<div class='ps-scrollbar-y'></div>").appendTo(a),c,h,p,d,v,m,g,y,b=parseInt(u.css("bottom"),10),w,E,S=parseInt(a.css("right"),10),x=n();var T=function(e,t){var n=e+t,r=d-w;if(n<0){E=0}else if(n>r){E=r}else{E=n}var i=parseInt(E*(m-d)/(d-w),10);o.scrollTop(i);u.css({bottom:b-i})};var N=function(e,t){var n=e+t,r=p-g;if(n<0){y=0}else if(n>r){y=r}else{y=n}var i=parseInt(y*(v-p)/(p-g),10);o.scrollLeft(i);a.css({right:S-i})};var C=function(e){if(s.minScrollbarLength){e=Math.max(e,s.minScrollbarLength)}return e};var k=function(){u.css({left:o.scrollLeft(),bottom:b-o.scrollTop(),width:p,display:c?"inherit":"none"});a.css({top:o.scrollTop(),right:S-o.scrollLeft(),height:d,display:h?"inherit":"none"});f.css({left:y,width:g});l.css({top:E,height:w})};var L=function(){p=o.width();d=o.height();v=o.prop("scrollWidth");m=o.prop("scrollHeight");if(!s.suppressScrollX&&p+s.scrollXMarginOffset<v){c=true;g=C(parseInt(p*p/v,10));y=parseInt(o.scrollLeft()*(p-g)/(v-p),10)}else{c=false;g=0;y=0;o.scrollLeft(0)}if(!s.suppressScrollY&&d+s.scrollYMarginOffset<m){h=true;w=C(parseInt(d*d/m,10));E=parseInt(o.scrollTop()*(d-w)/(m-d),10)}else{h=false;w=0;E=0;o.scrollTop(0)}if(E>=d-w){E=d-w}if(y>=p-g){y=p-g}k()};var A=function(){var t,n;f.bind("mousedown"+x,function(e){n=e.pageX;t=f.position().left;u.addClass("in-scrolling");e.stopPropagation();e.preventDefault()});e(document).bind("mousemove"+x,function(e){if(u.hasClass("in-scrolling")){N(t,e.pageX-n);e.stopPropagation();e.preventDefault()}});e(document).bind("mouseup"+x,function(e){if(u.hasClass("in-scrolling")){u.removeClass("in-scrolling")}});t=n=null};var O=function(){var t,n;l.bind("mousedown"+x,function(e){n=e.pageY;t=l.position().top;a.addClass("in-scrolling");e.stopPropagation();e.preventDefault()});e(document).bind("mousemove"+x,function(e){if(a.hasClass("in-scrolling")){T(t,e.pageY-n);e.stopPropagation();e.preventDefault()}});e(document).bind("mouseup"+x,function(e){if(a.hasClass("in-scrolling")){a.removeClass("in-scrolling")}});t=n=null};var M=function(e,t){var n=o.scrollTop();if(e===0){if(!h){return false}if(n===0&&t>0||n>=m-d&&t<0){return!s.wheelPropagation}}var r=o.scrollLeft();if(t===0){if(!c){return false}if(r===0&&e<0||r>=v-p&&e>0){return!s.wheelPropagation}}return true};var _=function(){var e=false;o.bind("mousewheel"+x,function(t,n,r,i){if(!s.useBothWheelAxes){o.scrollTop(o.scrollTop()-i*s.wheelSpeed);o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed)}else if(h&&!c){if(i){o.scrollTop(o.scrollTop()-i*s.wheelSpeed)}else{o.scrollTop(o.scrollTop()+r*s.wheelSpeed)}}else if(c&&!h){if(r){o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed)}else{o.scrollLeft(o.scrollLeft()-i*s.wheelSpeed)}}L();e=M(r,i);if(e){t.preventDefault()}});o.bind("MozMousePixelScroll"+x,function(t){if(e){t.preventDefault()}})};var D=function(){var t=false;o.bind("mouseenter"+x,function(e){t=true});o.bind("mouseleave"+x,function(e){t=false});var n=false;e(document).bind("keydown"+x,function(e){if(!t){return}var r=0,i=0;switch(e.which){case 37:r=-3;break;case 38:i=3;break;case 39:r=3;break;case 40:i=-3;break;case 33:i=9;break;case 32:case 34:i=-9;break;case 35:i=-d;break;case 36:i=d;break;default:return}o.scrollTop(o.scrollTop()-i*s.wheelSpeed);o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed);n=M(r,i);if(n){e.preventDefault()}})};var P=function(){var e=function(e){e.stopPropagation()};l.bind("click"+x,e);a.bind("click"+x,function(e){var t=parseInt(w/2,10),n=e.pageY-a.offset().top-t,r=d-w,i=n/r;if(i<0){i=0}else if(i>1){i=1}o.scrollTop((m-d)*i)});f.bind("click"+x,e);u.bind("click"+x,function(e){var t=parseInt(g/2,10),n=e.pageX-u.offset().left-t,r=p-g,i=n/r;if(i<0){i=0}else if(i>1){i=1}o.scrollLeft((v-p)*i)})};var H=function(){var t=function(e,t){o.scrollTop(o.scrollTop()-t);o.scrollLeft(o.scrollLeft()-e);L()};var n={},r=0,i={},s=null,u=false;e(window).bind("touchstart"+x,function(e){u=true});e(window).bind("touchend"+x,function(e){u=false});o.bind("touchstart"+x,function(e){var t=e.originalEvent.targetTouches[0];n.pageX=t.pageX;n.pageY=t.pageY;r=(new Date).getTime();if(s!==null){clearInterval(s)}e.stopPropagation()});o.bind("touchmove"+x,function(e){if(!u&&e.originalEvent.targetTouches.length===1){var s=e.originalEvent.targetTouches[0];var o={};o.pageX=s.pageX;o.pageY=s.pageY;var a=o.pageX-n.pageX,f=o.pageY-n.pageY;t(a,f);n=o;var l=(new Date).getTime();i.x=a/(l-r);i.y=f/(l-r);r=l;e.preventDefault()}});o.bind("touchend"+x,function(e){clearInterval(s);s=setInterval(function(){if(Math.abs(i.x)<.01&&Math.abs(i.y)<.01){clearInterval(s);return}t(i.x*30,i.y*30);i.x*=.8;i.y*=.8},10)})};var B=function(){o.bind("scroll"+x,function(e){L()})};var j=function(){o.unbind(x);e(window).unbind(x);e(document).unbind(x);o.data("perfect-scrollbar",null);o.data("perfect-scrollbar-update",null);o.data("perfect-scrollbar-destroy",null);f.remove();l.remove();u.remove();a.remove();f=l=p=d=v=m=g=y=b=w=E=S=null};var F=function(t){o.addClass("ie").addClass("ie"+t);var n=function(){var t=function(){e(this).addClass("hover")};var n=function(){e(this).removeClass("hover")};o.bind("mouseenter"+x,t).bind("mouseleave"+x,n);u.bind("mouseenter"+x,t).bind("mouseleave"+x,n);a.bind("mouseenter"+x,t).bind("mouseleave"+x,n);f.bind("mouseenter"+x,t).bind("mouseleave"+x,n);l.bind("mouseenter"+x,t).bind("mouseleave"+x,n)};var r=function(){k=function(){f.css({left:y+o.scrollLeft(),bottom:b,width:g});l.css({top:E+o.scrollTop(),right:S,height:w});f.hide().show();l.hide().show()}};if(t===6){n();r()}};var I="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch;var q=function(){var e=navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);if(e&&e[1]==="msie"){F(parseInt(e[2],10))}L();B();A();O();P();if(I){H()}if(o.mousewheel){_()}if(s.useKeyboard){D()}o.data("perfect-scrollbar",o);o.data("perfect-scrollbar-update",L);o.data("perfect-scrollbar-destroy",j)};q();return o})}})