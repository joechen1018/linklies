app.directive("browser", function(){
	return {
		restrict : "EA",
		templateUrl : "../templates/browser.html",
		controller : function($scope){

		},
		replace : true,
		scope: {
		    data : "=browserData"
		},
		link : function(scope, ele, attrs, ctrl){


			var u = scope.data.url;
			scope.qrcodeUrl = "http://chart.apis.google.com/chart?cht=qr&chl=" + encodeURIComponent(u) + 
							  "&chs=120x120";
			scope.url = u;
			scope.show = true;
		}
	}
});	