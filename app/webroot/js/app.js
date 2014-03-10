var glob = {};
glob.clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
glob.apiKey = "AIzaSyDgQMpZLRja-7wtmvfkMky_8ylI6OznE2c";
var onTranslated = function(data){
	_c.log(data);
}
var _events = {};
/*var $AnchorScrollProvider = function() {
  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    function scroll() {
    }
    return scroll;
  }];
}*/
var token;
var picker;
var pickerCallback = function(selection){
    _c.log(selection);
}
var createPicker = function createPicker(set, fn) {
    var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
    var _picker,
        _view = google.picker.ViewId;
    
    switch(set){
        case 'pick':
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCUMENTS)
                   .addView(_view.SPREADSHEETS)
                   .addView(_view.FORMS)
                   .addView(_view.PRESENTATIONS)
                   .addView(_view.DRAWINGS)
                   .addView(_view.DOCS_IMAGES)
                   .addView(_view.DOCS_VIDEOS)
                   .addView(_view.YOUTUBE)
                   .setCallback(fn)
                   .build();

        break;
        case 'pick.docs':
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCUMENTS)
                   .addView(_view.SPREADSHEETS)
                   .addView(_view.FORMS)
                   .addView(_view.PRESENTATIONS)
                   .addView(_view.DRAWINGS)
                   .setCallback(fn)
                   .build();
        break;
        case 'pick.images':
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCS_IMAGES)
                   .setCallback(fn)
                   .build();
        break;
        case 'pick.videos':
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCS_VIDEOS)
                   .setCallback(fn)
                   .build();
        break;
        case 'pick.files' :
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCS)
                   .setCallback(fn)
                   .build();
        break;
        case 'upload' :
            _picker = new google.picker.PickerBuilder()
                    .setAppId(clientId)
                    .setOAuthToken(token)
                    .addView(_view.PHOTO_UPLOAD)
                    .addView(
                        new google.picker.DocsUploadView() //** .setParent() .setTitle()
                    )
                    .setCallback(fn)
                    .build();
        break;
        case 'search' : 
            _picker = new google.picker.PickerBuilder()
                    .setAppId(clientId)
                    .setOAuthToken(token)
                    .addView(_view.VIDEO_SEARCH)
                    .addView(_view.IMAGE_SEARCH)
                    .setCallback(fn)
                    .build();
        break;
        case 'search.images' : 
            _picker = new google.picker.PickerBuilder()
                    .setAppId(clientId)
                    .setOAuthToken(token)
                    .addView(_view.IMAGE_SEARCH)
                    .setCallback(fn)
                    .build();
        break;
        case 'search.videos' : 
            _picker = new google.picker.PickerBuilder()
                    .setAppId(clientId)
                    .setOAuthToken(token)
                    .addView(_view.VIDEO_SEARCH)
                    .setCallback(fn)
                    .build();
        break;
        default : 
            _picker = new google.picker.PickerBuilder()
                   .setAppId(clientId)
                   .setOAuthToken(token)
                   .addView(_view.DOCS)
                   .setCallback(fn)
                   .build();
        break;
    }

    /*    
    addView(google.picker.ViewId.FOLDERS)
    addView(google.picker.ViewId.PHOTO_ALBUMS)
    addView(google.picker.ViewId.PHOTOS)
    addView(google.picker.ViewId.RECENTLY_PICKED)
    addView(google.picker.ViewId.WEBCAM)
    */

    return _picker
}
var app = angular.module("lk", ["ngRoute", "pasvaz.bindonce"], function($httpProvider){

})
.value('$anchorScroll', angular.noop)
//.provider('$anchorScroll', $AnchorScrollProvider)
.run(function($location){

    //** load google api v2
	(function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client.js?onload=onGApiLoaded';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();

    //** load open api  
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'http://www.google.com/jsapi';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    //** on unload
    $(window).bind("beforeunload",function(event){
        sessionStorage.clear();
        localStorage.clear();
       //return "";
    });
})
.config(function($routeProvider){
	// $routeProvider
	// .when("/sign", {
	// 	templateUrl : "templates/blank.html",
	// 	controller : function(){
	// 		console.log("going to sign");
	// 	}
	// });
	//.otherwise();
})
.directive('xngFocus', function() {
    return function(scope, element, attrs) {
       scope.$watch(attrs.xngFocus, 
         function (newValue) { 
         	var x = window.scrollX, y = window.scrollY;
            newValue && element.focus();
            window.scrollTo(x, y);
         },true);
      };    
})
.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
        /*
        */
    };
})
.directive('retrySrc', function (apiService) {
  var fallbackSrc = {
    link: function postLink(scope, ele, attrs) {
      ele.bind('error', function() {
        if(attrs.retrySrc === "api"){
            var data = scope.data;
            var getKey = function(name){
                try{
                    if(!name) return false;
                    if(name.indexOf('spreadsheet') !== -1) return data.url.match(/^http(s|):\/\/.*docs.google.com\/spreadsheet\/.*key=(.*)\&/)[2];
                    if(name.indexOf('document') !== -1) return data.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
                    if(name.indexOf('presentations') !== -1) return data.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
                }catch(e){
                    return false;
                }
            }
            if(typeof data.type === "object"){
                var key = getKey(data.type.name);
                if(key !== false){
                    var request = gapi.client.drive.files.get({
                        'fileId': key
                    });
                    request.execute(function(res) {
                        $(ele).attr("src", res.thumbnailLink);
                        data.thumb = res.thumbnailLink;
                        apiService.linkService.save(data);
                    });
                }
            }
        }else{
            angular.element(this).attr("src", attrs.retrySrc);
        }
      });
    }
   }
   return fallbackSrc;
})
.controller("appCtrl", function($scope){
	var checkAuth = function() {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, authorize);
        google.load("picker", "1", {
            callback : function(){
                _c.log("picker loaded");
            }
        });
	}
	$scope.onGApiLoaded = function(){
		//console.log("loaded");
		gapi.client.setApiKey(clientId);
		window.setTimeout(checkAuth,1);
	}
	window["onGApiLoaded"] = $scope.onGApiLoaded;

    var apiKey = glob.apiKey;
	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
	var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email';
	var secret = "zo03y8aW30ZAJnJLKYSH4b4v";
	var userId;
	var authorize = function(rs){
		//console.log(rs);
		if (rs && !rs.error && rs["access_token"]) {

            //** get token
            token = rs["access_token"];

			gapi.client.setApiKey("");
			gapi.client.load("drive", "v2", function(data){
                var request = gapi.client.drive.files.list({
                    'fileId': "root"
                });
                request.execute(function(res) {
                    _c.log(res);
                });

                /*gapi.load('picker', {'callback': function(){
                    var picker = new google.picker.PickerBuilder().
                      addView(google.picker.ViewId.PHOTOS).
                      setOAuthToken(token).
                      setDeveloperKey(apiKey).
                      setCallback(function(){
                      }).
                      build();
                  picker.setVisible(true);
                }});*/
		    	// var request = gapi.client.drive.files.list({'maxResults': 5 });
			    // request.execute(function(resp) {
			    // 	_c.log(resp);   
			    // });    
		    });



		} else {
			location.href = root + "users/login";
		}
	}
	$scope.app = {
		view : "desktop"
	}
})
.factory('$debounce', ['$rootScope', '$browser', '$q', '$exceptionHandler',
    function($rootScope,   $browser,   $q,   $exceptionHandler) {
        var deferreds = {},
            methods = {},
            uuid = 0;

        function debounce(fn, delay, invokeApply) {
            var deferred = $q.defer(),
                promise = deferred.promise,
                skipApply = (angular.isDefined(invokeApply) && !invokeApply),
                timeoutId, cleanup,
                methodId, bouncing = false;

            // check we dont have this method already registered
            angular.forEach(methods, function(value, key) {
                if(angular.equals(methods[key].fn, fn)) {
                    bouncing = true;
                    methodId = key;
                }
            });

            // not bouncing, then register new instance
            if(!bouncing) {
                methodId = uuid++;
                methods[methodId] = {fn: fn};
            } else {
                // clear the old timeout
                deferreds[methods[methodId].timeoutId].reject('bounced');
                $browser.defer.cancel(methods[methodId].timeoutId);
            }

            var debounced = function() {
                // actually executing? clean method bank
                delete methods[methodId];

                try {
                    deferred.resolve(fn());
                } catch(e) {
                    deferred.reject(e);
                    $exceptionHandler(e);
                }

                if (!skipApply) $rootScope.$apply();
            };

            timeoutId = $browser.defer(debounced, delay);

            // track id with method
            methods[methodId].timeoutId = timeoutId;

            cleanup = function(reason) {
                delete deferreds[promise.$$timeoutId];
            };

            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            promise.then(cleanup, cleanup);

            return promise;
        }


        // similar to angular's $timeout cancel
        debounce.cancel = function(promise) {
            if (promise && promise.$$timeoutId in deferreds) {
                deferreds[promise.$$timeoutId].reject('canceled');
                return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
        };

        return debounce;
}]);
var _q = function(){
	var interval,
		self = this,
		duration = 200,
		task,
		checkTask = function(){
			if(self.tasks.length === 0) return;
			task = self.tasks[0];
			if(typeof task === "function")
				task();
			self.tasks.shift();
		};

	this.tasks = [];
	this.push = function(task){
		this.tasks.push(task);
	}
	this.pause = function(){
		clearInterval(interval);
	}
	this.resume = function(){
		interval = setInterval(checkTask, duration);
	}
	interval = setInterval(checkTask, duration);
}
var taskQueue = new _q();
var loader = {},
	expectCount = $(".icon img").length;

var colorShiftIntv,
    startColorShifting = function($target, duration){
        var blue = "#4b9884", green = "#aacc8e", yellow = "#faec0a", orange = "#fe9d04",
            duration = duration || 200, 
            colors = [blue, orange, green, yellow],
            i = 0,
            animate = function(){
                $target.animate({
                    backgroundColor : colors[i%colors.length]
                }, duration);
                i++;    
            }
        colorShiftIntv = setInterval(animate, duration);
    },
    stopColorShifting = function(){
        clearInterval(colorShiftIntv);
    }   

$(document).ready(function(){
    //** select text range
    jQuery.fn.selectText=function(){var e=document;var t=this[0];console.log(this,t);if(e.body.createTextRange){var n=document.body.createTextRange();n.moveToElementText(t);n.select()}else if(window.getSelection){var r=window.getSelection();var n=document.createRange();n.selectNodeContents(t);r.removeAllRanges();r.addRange(n)}}
    
});

//** show an image before all icons loaded
loader.events = {};
loader.count = 0;
$(loader.events)
.bind("success", function(){
	loader.count++;
	if(loader.count === expectCount) $(loader.events).trigger("reachedExpectation");
})
.bind("error", function(){
	loader.count++;
    if(loader.count === expectCount) $(loader.events).trigger("reachedExpectation");
})
.bind("reachedExpectation", function(){
    //$("#bg-loading").delay(1000).hide();
    //$("body").delay(1000).css("overflow-y", "auto");
});

app.utils = app.utils || {};
app.utils.isUrl = function(s){
	var regexp = /^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/
	return regexp.test(s);
}
app.utils.replace = function(str, obj){
    if(str === undefined){
        throw "string to be replaced is undefined";
    }
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

$(document).ready(function(){
	//$('body').perfectScrollbar();
});