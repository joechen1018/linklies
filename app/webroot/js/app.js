var glob = {};
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
});

app.utils = app.utils || {};
app.utils.isUrl = function(s){
	var regexp = /^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/
	return regexp.test(s);
}

$(document).ready(function(){
	//$('body').perfectScrollbar();
});