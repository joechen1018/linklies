var glob = {},
	_c = console;

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
		initColorShifting();
	}
	//color shifting
	var colorShift;
	var initColorShifting = function(){
		var blue = "#4b9884", green = "#aacc8e", dark = "#454438", orange = "#fe9d04";
		var duration = 1200, colors = [blue, orange, green, dark];
		var i = 0;
		colorShift = setInterval(function(){
			$("#checking-button").animate({
				backgroundColor : colors[i%colors.length]
			}, duration);
			i++;
		}, 200);
	}

	//oauth
	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
	var scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/urlshortener';
	var token;
	var secret = "zo03y8aW30ZAJnJLKYSH4b4v";
	var userId;
	var checkAuth = function() {

		gapi.auth.authorize({
			client_id: clientId, 
			scope: scopes, 
			immediate: false
		}, authorize);

		$scope.$apply(function(){
			$scope.state = "checking";
		});
	}

	var authorize = function(rs){

		//** successfully authorized
		if (rs && !rs.error && rs["access_token"]) {
			//** save cookie
			token = rs["access_token"];
			$.cookie("user.token", token);

			//** for some google bug the api key needs to be reset to nothing
			gapi.client.setApiKey("");
		    gapi.client.load('plus', 'v1', function() {
		        var request = gapi.client.plus.people.get({
		            'userId': 'me'
		        });
		        request.execute(function(resp) {
		        	if(resp.isPlusUser){
		        		$.ajax({
			        		url : "login",
			        		method : "post",
			        		data : resp,
			        		success : function(res){
			        			if(typeof sessionStorage !== undefined){
			        				_c.log("saving data to sessionStorage");
			        				sessionStorage.setItem("userData", JSON.stringify(res));
			        			}
			        			var user = res.data.User;
			        			if(user && user.username_id){
			        				location.href = root + user.username_id
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
	}

	$scope.onGApiLoaded = function(){
		gapi.client.setApiKey(clientId);
		window.setTimeout(checkAuth, 1);
	}

	//** dynamically generated google api callback
	window["onGApiLoaded"] = $scope.onGApiLoaded;

	//** set initial state
	$scope.state = "checking";
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
