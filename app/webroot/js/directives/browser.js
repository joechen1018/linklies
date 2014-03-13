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

			var u = "http://www.catswhocode.com/blog/10-awesome-things-to-do-with-curl";
			scope.qrcodeUrl = "http://chart.apis.google.com/chart?cht=qr&chl=" + encodeURIComponent(u) + 
							  "&chs=120x120";
			scope.url = u;
			scope.show = true;
		}
	}
});	