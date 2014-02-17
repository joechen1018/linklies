//jquery-url-parser
!function(factory){"function"==typeof define&&define.amd?define(factory):window.purl=factory()}(function(){function parseUri(url,strictMode){for(var str=decodeURI(url),res=parser[strictMode?"strict":"loose"].exec(str),uri={attr:{},param:{},seg:{}},i=14;i--;)uri.attr[key[i]]=res[i]||"";return uri.param.query=parseString(uri.attr.query),uri.param.fragment=parseString(uri.attr.fragment),uri.seg.path=uri.attr.path.replace(/^\/+|\/+$/g,"").split("/"),uri.seg.fragment=uri.attr.fragment.replace(/^\/+|\/+$/g,"").split("/"),uri.attr.base=uri.attr.host?(uri.attr.protocol?uri.attr.protocol+"://"+uri.attr.host:uri.attr.host)+(uri.attr.port?":"+uri.attr.port:""):"",uri}function getAttrName(elm){var tn=elm.tagName;return"undefined"!=typeof tn?tag2attr[tn.toLowerCase()]:tn}function promote(parent,key){if(0===parent[key].length)return parent[key]={};var t={};for(var i in parent[key])t[i]=parent[key][i];return parent[key]=t,t}function parse(parts,parent,key,val){var part=parts.shift();if(part){var obj=parent[key]=parent[key]||[];"]"==part?isArray(obj)?""!==val&&obj.push(val):"object"==typeof obj?obj[keys(obj).length]=val:obj=parent[key]=[parent[key],val]:~part.indexOf("]")?(part=part.substr(0,part.length-1),!isint.test(part)&&isArray(obj)&&(obj=promote(parent,key)),parse(parts,obj,part,val)):(!isint.test(part)&&isArray(obj)&&(obj=promote(parent,key)),parse(parts,obj,part,val))}else isArray(parent[key])?parent[key].push(val):parent[key]="object"==typeof parent[key]?val:"undefined"==typeof parent[key]?val:[parent[key],val]}function merge(parent,key,val){if(~key.indexOf("]")){var parts=key.split("[");parse(parts,parent,"base",val)}else{if(!isint.test(key)&&isArray(parent.base)){var t={};for(var k in parent.base)t[k]=parent.base[k];parent.base=t}""!==key&&set(parent.base,key,val)}return parent}function parseString(str){return reduce(String(str).split(/&|;/),function(ret,pair){try{pair=decodeURIComponent(pair.replace(/\+/g," "))}catch(e){}var eql=pair.indexOf("="),brace=lastBraceInKey(pair),key=pair.substr(0,brace||eql),val=pair.substr(brace||eql,pair.length);return val=val.substr(val.indexOf("=")+1,val.length),""===key&&(key=pair,val=""),merge(ret,key,val)},{base:{}}).base}function set(obj,key,val){var v=obj[key];"undefined"==typeof v?obj[key]=val:isArray(v)?v.push(val):obj[key]=[v,val]}function lastBraceInKey(str){for(var brace,c,len=str.length,i=0;len>i;++i)if(c=str[i],"]"==c&&(brace=!1),"["==c&&(brace=!0),"="==c&&!brace)return i}function reduce(obj,accumulator){for(var i=0,l=obj.length>>0,curr=arguments[2];l>i;)i in obj&&(curr=accumulator.call(void 0,curr,obj[i],i,obj)),++i;return curr}function isArray(vArg){return"[object Array]"===Object.prototype.toString.call(vArg)}function keys(obj){var key_array=[];for(var prop in obj)obj.hasOwnProperty(prop)&&key_array.push(prop);return key_array}function purl(url,strictMode){return 1===arguments.length&&url===!0&&(strictMode=!0,url=void 0),strictMode=strictMode||!1,url=url||window.location.toString(),{data:parseUri(url,strictMode),attr:function(attr){return attr=aliases[attr]||attr,"undefined"!=typeof attr?this.data.attr[attr]:this.data.attr},param:function(param){return"undefined"!=typeof param?this.data.param.query[param]:this.data.param.query},fparam:function(param){return"undefined"!=typeof param?this.data.param.fragment[param]:this.data.param.fragment},segment:function(seg){return"undefined"==typeof seg?this.data.seg.path:(seg=0>seg?this.data.seg.path.length+seg:seg-1,this.data.seg.path[seg])},fsegment:function(seg){return"undefined"==typeof seg?this.data.seg.fragment:(seg=0>seg?this.data.seg.fragment.length+seg:seg-1,this.data.seg.fragment[seg])}}}var tag2attr={a:"href",img:"src",form:"action",base:"href",script:"src",iframe:"src",link:"href"},key=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"],aliases={anchor:"fragment"},parser={strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/},isint=/^[0-9]+$/;return purl.jQuery=function($){null!=$&&($.fn.url=function(strictMode){var url="";return this.length&&(url=$(this).attr(getAttrName(this[0]))||""),purl(url,strictMode)},$.url=purl)},purl.jQuery(window.jQuery),purl});

//jquery cookie
(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){function n(e){return u.raw?e:encodeURIComponent(e)}function r(e){return u.raw?e:decodeURIComponent(e)}function i(e){return n(u.json?JSON.stringify(e):String(e))}function s(e){if(e.indexOf('"')===0){e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{e=decodeURIComponent(e.replace(t," "));return u.json?JSON.parse(e):e}catch(n){}}function o(t,n){var r=u.raw?t:s(t);return e.isFunction(n)?n(r):r}var t=/\+/g;var u=e.cookie=function(t,s,a){if(s!==undefined&&!e.isFunction(s)){a=e.extend({},u.defaults,a);if(typeof a.expires==="number"){var f=a.expires,l=a.expires=new Date;l.setTime(+l+f*864e5)}return document.cookie=[n(t),"=",i(s),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}var c=t?undefined:{};var h=document.cookie?document.cookie.split("; "):[];for(var p=0,d=h.length;p<d;p++){var v=h[p].split("=");var m=r(v.shift());var g=v.join("=");if(t&&t===m){c=o(g,s);break}if(!t&&(g=o(g))!==undefined){c[m]=g}}return c};u.defaults={};e.removeCookie=function(t,n){if(e.cookie(t)===undefined){return false}e.cookie(t,"",e.extend({},n,{expires:-1}));return!e.cookie(t)}});

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);


/*!
  * jquery perfect scrollbar
*/

(function(e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else{e(jQuery)}})(function(e){var t={wheelSpeed:10,wheelPropagation:false,minScrollbarLength:null,useBothWheelAxes:false,useKeyboard:true,suppressScrollX:false,suppressScrollY:false,scrollXMarginOffset:0,scrollYMarginOffset:0};var n=function(){var e=0;return function(){var t=e;e+=1;return".perfect-scrollbar-"+t}}();e.fn.perfectScrollbar=function(r,i){return this.each(function(){var s=e.extend(true,{},t),o=e(this);if(typeof r==="object"){e.extend(true,s,r)}else{i=r}if(i==="update"){if(o.data("perfect-scrollbar-update")){o.data("perfect-scrollbar-update")()}return o}else if(i==="destroy"){if(o.data("perfect-scrollbar-destroy")){o.data("perfect-scrollbar-destroy")()}return o}if(o.data("perfect-scrollbar")){return o.data("perfect-scrollbar")}o.addClass("ps-container");var u=e("<div class='ps-scrollbar-x-rail'></div>").appendTo(o),a=e("<div class='ps-scrollbar-y-rail'></div>").appendTo(o),f=e("<div class='ps-scrollbar-x'></div>").appendTo(u),l=e("<div class='ps-scrollbar-y'></div>").appendTo(a),c,h,p,d,v,m,g,y,b=parseInt(u.css("bottom"),10),w,E,S=parseInt(a.css("right"),10),x=n();var T=function(e,t){var n=e+t,r=d-w;if(n<0){E=0}else if(n>r){E=r}else{E=n}var i=parseInt(E*(m-d)/(d-w),10);o.scrollTop(i);u.css({bottom:b-i})};var N=function(e,t){var n=e+t,r=p-g;if(n<0){y=0}else if(n>r){y=r}else{y=n}var i=parseInt(y*(v-p)/(p-g),10);o.scrollLeft(i);a.css({right:S-i})};var C=function(e){if(s.minScrollbarLength){e=Math.max(e,s.minScrollbarLength)}return e};var k=function(){u.css({left:o.scrollLeft(),bottom:b-o.scrollTop(),width:p,display:c?"inherit":"none"});a.css({top:o.scrollTop(),right:S-o.scrollLeft(),height:d,display:h?"inherit":"none"});f.css({left:y,width:g});l.css({top:E,height:w})};var L=function(){p=o.width();d=o.height();v=o.prop("scrollWidth");m=o.prop("scrollHeight");if(!s.suppressScrollX&&p+s.scrollXMarginOffset<v){c=true;g=C(parseInt(p*p/v,10));y=parseInt(o.scrollLeft()*(p-g)/(v-p),10)}else{c=false;g=0;y=0;o.scrollLeft(0)}if(!s.suppressScrollY&&d+s.scrollYMarginOffset<m){h=true;w=C(parseInt(d*d/m,10));E=parseInt(o.scrollTop()*(d-w)/(m-d),10)}else{h=false;w=0;E=0;o.scrollTop(0)}if(E>=d-w){E=d-w}if(y>=p-g){y=p-g}k()};var A=function(){var t,n;f.bind("mousedown"+x,function(e){n=e.pageX;t=f.position().left;u.addClass("in-scrolling");e.stopPropagation();e.preventDefault()});e(document).bind("mousemove"+x,function(e){if(u.hasClass("in-scrolling")){N(t,e.pageX-n);e.stopPropagation();e.preventDefault()}});e(document).bind("mouseup"+x,function(e){if(u.hasClass("in-scrolling")){u.removeClass("in-scrolling")}});t=n=null};var O=function(){var t,n;l.bind("mousedown"+x,function(e){n=e.pageY;t=l.position().top;a.addClass("in-scrolling");e.stopPropagation();e.preventDefault()});e(document).bind("mousemove"+x,function(e){if(a.hasClass("in-scrolling")){T(t,e.pageY-n);e.stopPropagation();e.preventDefault()}});e(document).bind("mouseup"+x,function(e){if(a.hasClass("in-scrolling")){a.removeClass("in-scrolling")}});t=n=null};var M=function(e,t){var n=o.scrollTop();if(e===0){if(!h){return false}if(n===0&&t>0||n>=m-d&&t<0){return!s.wheelPropagation}}var r=o.scrollLeft();if(t===0){if(!c){return false}if(r===0&&e<0||r>=v-p&&e>0){return!s.wheelPropagation}}return true};var _=function(){var e=false;o.bind("mousewheel"+x,function(t,n,r,i){if(!s.useBothWheelAxes){o.scrollTop(o.scrollTop()-i*s.wheelSpeed);o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed)}else if(h&&!c){if(i){o.scrollTop(o.scrollTop()-i*s.wheelSpeed)}else{o.scrollTop(o.scrollTop()+r*s.wheelSpeed)}}else if(c&&!h){if(r){o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed)}else{o.scrollLeft(o.scrollLeft()-i*s.wheelSpeed)}}L();e=M(r,i);if(e){t.preventDefault()}});o.bind("MozMousePixelScroll"+x,function(t){if(e){t.preventDefault()}})};var D=function(){var t=false;o.bind("mouseenter"+x,function(e){t=true});o.bind("mouseleave"+x,function(e){t=false});var n=false;e(document).bind("keydown"+x,function(e){if(!t){return}var r=0,i=0;switch(e.which){case 37:r=-3;break;case 38:i=3;break;case 39:r=3;break;case 40:i=-3;break;case 33:i=9;break;case 32:case 34:i=-9;break;case 35:i=-d;break;case 36:i=d;break;default:return}o.scrollTop(o.scrollTop()-i*s.wheelSpeed);o.scrollLeft(o.scrollLeft()+r*s.wheelSpeed);n=M(r,i);if(n){e.preventDefault()}})};var P=function(){var e=function(e){e.stopPropagation()};l.bind("click"+x,e);a.bind("click"+x,function(e){var t=parseInt(w/2,10),n=e.pageY-a.offset().top-t,r=d-w,i=n/r;if(i<0){i=0}else if(i>1){i=1}o.scrollTop((m-d)*i)});f.bind("click"+x,e);u.bind("click"+x,function(e){var t=parseInt(g/2,10),n=e.pageX-u.offset().left-t,r=p-g,i=n/r;if(i<0){i=0}else if(i>1){i=1}o.scrollLeft((v-p)*i)})};var H=function(){var t=function(e,t){o.scrollTop(o.scrollTop()-t);o.scrollLeft(o.scrollLeft()-e);L()};var n={},r=0,i={},s=null,u=false;e(window).bind("touchstart"+x,function(e){u=true});e(window).bind("touchend"+x,function(e){u=false});o.bind("touchstart"+x,function(e){var t=e.originalEvent.targetTouches[0];n.pageX=t.pageX;n.pageY=t.pageY;r=(new Date).getTime();if(s!==null){clearInterval(s)}e.stopPropagation()});o.bind("touchmove"+x,function(e){if(!u&&e.originalEvent.targetTouches.length===1){var s=e.originalEvent.targetTouches[0];var o={};o.pageX=s.pageX;o.pageY=s.pageY;var a=o.pageX-n.pageX,f=o.pageY-n.pageY;t(a,f);n=o;var l=(new Date).getTime();i.x=a/(l-r);i.y=f/(l-r);r=l;e.preventDefault()}});o.bind("touchend"+x,function(e){clearInterval(s);s=setInterval(function(){if(Math.abs(i.x)<.01&&Math.abs(i.y)<.01){clearInterval(s);return}t(i.x*30,i.y*30);i.x*=.8;i.y*=.8},10)})};var B=function(){o.bind("scroll"+x,function(e){L()})};var j=function(){o.unbind(x);e(window).unbind(x);e(document).unbind(x);o.data("perfect-scrollbar",null);o.data("perfect-scrollbar-update",null);o.data("perfect-scrollbar-destroy",null);f.remove();l.remove();u.remove();a.remove();f=l=p=d=v=m=g=y=b=w=E=S=null};var F=function(t){o.addClass("ie").addClass("ie"+t);var n=function(){var t=function(){e(this).addClass("hover")};var n=function(){e(this).removeClass("hover")};o.bind("mouseenter"+x,t).bind("mouseleave"+x,n);u.bind("mouseenter"+x,t).bind("mouseleave"+x,n);a.bind("mouseenter"+x,t).bind("mouseleave"+x,n);f.bind("mouseenter"+x,t).bind("mouseleave"+x,n);l.bind("mouseenter"+x,t).bind("mouseleave"+x,n)};var r=function(){k=function(){f.css({left:y+o.scrollLeft(),bottom:b,width:g});l.css({top:E+o.scrollTop(),right:S,height:w});f.hide().show();l.hide().show()}};if(t===6){n();r()}};var I="ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch;var q=function(){var e=navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);if(e&&e[1]==="msie"){F(parseInt(e[2],10))}L();B();A();O();P();if(I){H()}if(o.mousewheel){_()}if(s.useKeyboard){D()}o.data("perfect-scrollbar",o);o.data("perfect-scrollbar-update",L);o.data("perfect-scrollbar-destroy",j)};q();return o})}})