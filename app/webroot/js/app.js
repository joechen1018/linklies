var glob = {};
glob.clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
glob.apiKey = "AIzaSyAMc2ySuLe0TmVRTQ0SxfYDijYvOd5BRTM";
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
var app = angular.module("lk", ["ngRoute"], function($httpProvider){

})
.value('$anchorScroll', angular.noop)
//.provider('$anchorScroll', $AnchorScrollProvider)
.run(function($location){

	(function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client.js?onload=onGApiLoaded';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();
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
.controller("appCtrl", function($scope){
	var checkAuth = function() {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, authorize);
	}
	$scope.onGApiLoaded = function(){
		//console.log("loaded");
		gapi.client.setApiKey(clientId);
		window.setTimeout(checkAuth,1);
	}
	window["onGApiLoaded"] = $scope.onGApiLoaded;
	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
	var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email';
	var token;
	var secret = "zo03y8aW30ZAJnJLKYSH4b4v";
	var userId;
	var authorize = function(rs){
		//console.log(rs);
		if (rs && !rs.error && rs["access_token"]) {
			gapi.client.setApiKey("");
			gapi.client.load("drive", "v2", function(data){
				//_c.log(gapi.client.drive);
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

loader.events = {};
loader.count = 0

$(loader.events)
.bind("success", function(){
	loader.count++;
	// _c.log(loader.count);
	if(loader.count === expectCount) $(loader.events).trigger("reachedExpectation");
})
.bind("error", function(){
	loader.count++;
	// _c.log("error:" + loader.count);
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

$(document).ready(function(){
	//$('body').perfectScrollbar();
});