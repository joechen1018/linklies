var signinCallback = function(data){
	console.log(data);
}
var glob = {};
var app = angular.module("lk", ["ngRoute"])
.run(function($location){

	//console.log($.cookie("user.token"));

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
.controller("userCtrl", function($scope){
	
	var init = function(){
		console.log("init");
		initColorShifting();
	}
	//color shifting
	var colorShift;
	var initColorShifting = function(){
		console.log("init color shift");
		var blue = "#4b9884", green = "#aacc8e", dark = "#454438", orange = "#fe9d04";
		var duration = 1200, colors = [blue, orange, green, dark];
		var i = 0;
		colorShift = setInterval(function(){
			console.log("color shift");
			// $("#checking-button").animate({
			// 	backgroundColor : colors[i%colors.length]
			// }, duration);
			i++;
		}, 200);
	}

	//oauth
	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
	var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email';
	var token;
	var secret = "zo03y8aW30ZAJnJLKYSH4b4v";
	var userId;
	var checkAuth = function() {
		console.log("check auth");
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, authorize);
	}

	var authorize = function(rs){
		console.log("authorize");
		if (rs && !rs.error && rs["access_token"]) {
			//authorized

			//save cookie
			token = rs["access_token"];
			$.cookie("user.token", token);

			//location.href = root + $.cookie("user.token");

			gapi.client.setApiKey("");
		    gapi.client.load('plus', 'v1', function() {
		        var request = gapi.client.plus.people.get({
		            'userId': 'me'
		        });

		        request.execute(function(resp) {
		        	//resp.token = token;
		        	//console.log(resp);
		        	if(resp.isPlusUser){
		        		$.ajax({
			        		url : "login",
			        		method : "post",
			        		data : resp,
			        		success : function(res){
			        			console.log(res);
			        			var user = res.data.User;
			        			if(user && user.username_id){
			        				location.href = root + user.username_id
			        				console.log(root + user.username_id);
			        				return;
			        			}
			        			//location.href = root + res.userId;
			        		},
			        		error : function(){

			        		}
			        	});
		        	}else{
		        		alert("You need to be a Google+ user to continue");
		        		location.href = "https://plus.google.com/";
		        		/*
		        		$scope.state = "sign";
						$scope.$apply();
						*/
		        	}

		         });
		    });

		} else {
			$("#authorize-button").click(onAuthBtnClick);
			$scope.state = "sign";
			$scope.$apply();
		}
	}

	var onAuthBtnClick = function(){
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, authorize);
		return false;
	}

	var makeApiCall = function(){
		gapi.client.setApiKey("");
	    gapi.client.load('plus', 'v1', function() {
	    	//console.log(gapi.client);
	        var request = gapi.client.plus.people.get({
	            'userId': 'me'
	        });

	        request.execute(function(resp) {
	        	console.log(resp);
	         });
	    });

	    gapi.client.load("drive", "v2", function(){
	    	//console.log(gapi.client.drive);
	    	var request = gapi.client.drive.about.get({
	        });
	        request.execute(function(resp) {
	        	console.log(resp);
	         });
	    });
	}

	$scope.state = "checking";	
	$scope.onGApiLoaded = function(){
		console.log("api loaded");
		gapi.client.setApiKey(clientId);
		window.setTimeout(checkAuth, 1);
	}
	window["onGApiLoaded"] = $scope.onGApiLoaded;

	$scope.isState = function(state){
		return state === $scope.state;
	}

	init();
});

app.utils = app.utils || {};
app.utils.isUrl = function(s){
	var regexp = /^s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+$/
	return regexp.test(s);
}
