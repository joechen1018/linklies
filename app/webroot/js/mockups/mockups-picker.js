//** angularjs bindonce
!function(){"use strict";var e=angular.module("pasvaz.bindonce",[]);e.directive("bindonce",function(){var e=function(e){if(e&&0!==e.length){var t=angular.lowercase(""+e);e=!("f"===t||"0"===t||"false"===t||"no"===t||"n"===t||"[]"===t)}else e=!1;return e},t=parseInt((/msie (\d+)/.exec(angular.lowercase(navigator.userAgent))||[])[1],10);isNaN(t)&&(t=parseInt((/trident\/.*; rv:(\d+)/.exec(angular.lowercase(navigator.userAgent))||[])[1],10));var r={restrict:"AM",controller:["$scope","$element","$attrs","$interpolate",function(r,a,i,n){var c=function(t,r,a){var i="show"===r?"":"none",n="hide"===r?"":"none";t.css("display",e(a)?i:n)},o=function(e,t){if(angular.isObject(t)&&!angular.isArray(t)){var r=[];angular.forEach(t,function(e,t){e&&r.push(t)}),t=r}t&&e.addClass(angular.isArray(t)?t.join(" "):t)},s=function(e,t){e.transclude(t,function(t){var r=e.element.parent(),a=e.element&&e.element[e.element.length-1],i=r&&r[0]||a&&a.parentNode,n=a&&a.nextSibling||null;angular.forEach(t,function(e){i.insertBefore(e,n)})})},l={watcherRemover:void 0,binders:[],group:i.boName,element:a,ran:!1,addBinder:function(e){this.binders.push(e),this.ran&&this.runBinders()},setupWatcher:function(e){var t=this;this.watcherRemover=r.$watch(e,function(e){void 0!==e&&(t.removeWatcher(),t.checkBindonce(e))},!0)},checkBindonce:function(e){var t=this,r=e.$promise?e.$promise.then:e.then;"function"==typeof r?r(function(){t.runBinders()}):t.runBinders()},removeWatcher:function(){void 0!==this.watcherRemover&&(this.watcherRemover(),this.watcherRemover=void 0)},runBinders:function(){for(;this.binders.length>0;){var r=this.binders.shift();if(!this.group||this.group==r.group){var a=r.scope.$eval(r.interpolate?n(r.value):r.value);switch(r.attr){case"boIf":e(a)&&s(r,r.scope.$new());break;case"boSwitch":var i,l=r.controller[0];(i=l.cases["!"+a]||l.cases["?"])&&(r.scope.$eval(r.attrs.change),angular.forEach(i,function(e){s(e,r.scope.$new())}));break;case"boSwitchWhen":var u=r.controller[0];u.cases["!"+r.attrs.boSwitchWhen]=u.cases["!"+r.attrs.boSwitchWhen]||[],u.cases["!"+r.attrs.boSwitchWhen].push({transclude:r.transclude,element:r.element});break;case"boSwitchDefault":var u=r.controller[0];u.cases["?"]=u.cases["?"]||[],u.cases["?"].push({transclude:r.transclude,element:r.element});break;case"hide":case"show":c(r.element,r.attr,a);break;case"class":o(r.element,a);break;case"text":r.element.text(a);break;case"html":r.element.html(a);break;case"style":r.element.css(a);break;case"src":r.element.attr(r.attr,a),t&&r.element.prop("src",a);break;case"attr":angular.forEach(r.attrs,function(e,t){var a,i;t.match(/^boAttr./)&&r.attrs[t]&&(a=t.replace(/^boAttr/,"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),i=r.scope.$eval(r.attrs[t]),r.element.attr(a,i))});break;case"href":case"alt":case"title":case"id":case"value":r.element.attr(r.attr,a)}}}this.ran=!0}};return l}],link:function(e,t,r,a){var i=r.bindonce&&e.$eval(r.bindonce);void 0!==i?a.checkBindonce(i):(a.setupWatcher(r.bindonce),t.bind("$destroy",a.removeWatcher))}};return r}),angular.forEach([{directiveName:"boShow",attribute:"show"},{directiveName:"boHide",attribute:"hide"},{directiveName:"boClass",attribute:"class"},{directiveName:"boText",attribute:"text"},{directiveName:"boBind",attribute:"text"},{directiveName:"boHtml",attribute:"html"},{directiveName:"boSrcI",attribute:"src",interpolate:!0},{directiveName:"boSrc",attribute:"src"},{directiveName:"boHrefI",attribute:"href",interpolate:!0},{directiveName:"boHref",attribute:"href"},{directiveName:"boAlt",attribute:"alt"},{directiveName:"boTitle",attribute:"title"},{directiveName:"boId",attribute:"id"},{directiveName:"boStyle",attribute:"style"},{directiveName:"boValue",attribute:"value"},{directiveName:"boAttr",attribute:"attr"},{directiveName:"boIf",transclude:"element",terminal:!0,priority:1e3},{directiveName:"boSwitch",require:"boSwitch",controller:function(){this.cases={}}},{directiveName:"boSwitchWhen",transclude:"element",priority:800,require:"^boSwitch"},{directiveName:"boSwitchDefault",transclude:"element",priority:800,require:"^boSwitch"}],function(t){var r=200;return e.directive(t.directiveName,function(){var e={priority:t.priority||r,transclude:t.transclude||!1,terminal:t.terminal||!1,require:["^bindonce"].concat(t.require||[]),controller:t.controller,compile:function(e,r,a){return function(e,r,i,n){var c=n[0],o=i.boParent;if(o&&c.group!==o){var s=c.element.parent();c=void 0;for(var l;9!==s[0].nodeType&&s.length;){if((l=s.data("$bindonceController"))&&l.group===o){c=l;break}s=s.parent()}if(!c)throw new Error("No bindonce controller: "+o)}c.addBinder({element:r,attr:t.attribute||t.directiveName,attrs:i,value:i[t.directiveName],interpolate:t.interpolate,group:o,transclude:a,controller:n.slice(1),scope:e})}}};return e})})}();

//** initiate app
var app = angular.module("mk", [], function($httpProvider){

})
.run(function(){

	//** include open api
	(function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'http://www.google.com/jsapi?onload=onJsApiLoaded';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();

	  
	  window['onJsApiLoaded'] = function(){
	  	console.log('js api loaded');
	  }
})
.controller("mockupsCtrl", function($scope, apiService, apiParser){

	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com",
		apiKey = "AIzaSyDgQMpZLRja-7wtmvfkMky_8ylI6OznE2c",
		//scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/photos',
		scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email',
		token = "",
		pickerCallback = function(res){
			_c.log(res);
		},
		createPicker = function createPicker() {
	        var picker = new google.picker.PickerBuilder().
	        	setAppId(clientId).
                setOAuthToken(token).
	            addView(google.picker.ViewId.DOCS_IMAGES).
	            addView(google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS).
	            addView(google.picker.ViewId.DOCS_VIDEOS).
	            addView(google.picker.ViewId.DOCUMENTS).
	            addView(google.picker.ViewId.DRAWINGS).
	            addView(google.picker.ViewId.FOLDERS).
	            addView(google.picker.ViewId.FORMS).
	            addView(google.picker.ViewId.IMAGE_SEARCH).
	            addView(google.picker.ViewId.PDFS).
	            addView(google.picker.ViewId.PHOTO_ALBUMS).
	            addView(google.picker.ViewId.PHOTO_UPLOAD).
	            addView(google.picker.ViewId.PHOTOS).
	            addView(google.picker.ViewId.PRESENTATIONS).
	            addView(google.picker.ViewId.RECENTLY_PICKED).
	            addView(google.picker.ViewId.SPREADSHEETS).
	            addView(google.picker.ViewId.VIDEO_SEARCH).
	            addView(google.picker.ViewId.WEBCAM).
	            addView(google.picker.ViewId.YOUTUBE).
	            setCallback(pickerCallback).
	            build();
	        picker.setVisible(true);
	    },
		authorize = function(rs){
			if (rs && !rs.error && rs["access_token"]) {
				token = rs["access_token"];
				google.load("picker", "1", {
					callback : function(){
						createPicker();
					}
				});

				/*
				//** load drive api example
				gapi.client.setApiKey("");
				gapi.client.load("drive", "v2", function(data){

	                var request = gapi.client.drive.files.list({
	                    'fileId': "root"
	                });
	                request.execute(function(res) {
	                    //_c.log(res);
	                });
			    });*/



			} else {
				//location.href = root + "users/login";
			}
		},
		checkAuth = function() {
			gapi.auth.authorize({
				client_id: clientId, 
				scope: scopes, 
				immediate: true}, authorize);
		};

	(function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client.js?onload=onGApiLoaded';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();	

	 $scope.onGApiLoaded = function(){
		//console.log("loaded");
		gapi.client.setApiKey(clientId);
		window.setTimeout(checkAuth,1);
	}
	window["onGApiLoaded"] = $scope.onGApiLoaded; 
	
	//** google picker
	



	/*browser
	$scope.browserData = {
		url : "http://www.inside.com.tw/2014/02/21/bars-wants-to-be-xiaomi-in-taiwan-on-flyingv"
	}*/

	/*folder
	var service = apiService.folderService;
	service.get(1, true).then(function(data){
		data = data.data;
		$scope.$apply(function(){
			$scope.folder = data.Folder;
			$scope.type = data.FolderType;
		});
	});*/
	
	/*search view
	var service = apiService.linkService;
	service.get(542).then(function(link){
		link = apiParser.linkFromDb(link);
		_c.log(link);
		$scope.$apply(function(){
			$scope.results = link.type.results;
		});
	});*/

	/*qa view
	var service = apiService.linkService;
	service.get(626).then(function(link){
		
		link = apiParser.linkFromDb(link);
		link.state = {
			name : "ready"
		}
		_c.log(link);
		$scope.$apply(function(){
			$scope.links = [link];
			$scope.data = link;
			$(".q").append(link.type.qblock);
			$(".a").append(link.type.ablock);
			$("pre").addClass("theme-super");
		});
	});*/
});


var glob = {};
glob.clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
glob.apiKey = "AIzaSyDgQMpZLRja-7wtmvfkMky_8ylI6OznE2c";
var loader = {},
	expectCount = $(".icon img").length,
	_events = {} ;

loader.events = {};
loader.count = 0;
$(loader.events)
.bind("success", function(){
})
.bind("error", function(){
})
.bind("reachedExpectation", function(){
});

app.utils = app.utils || {};
app.utils.isUrl = function(s){
	var regexp = /^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/
	return regexp.test(s);
}
app.utils.replace = function(str, obj){
	for(var i in obj){
		str = str.replace("{{" + i + "}}", obj[i]);
	}
	return str;
}

app.utils.clone = function(obj){
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = utils.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = utils.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

var utils = app.utils;