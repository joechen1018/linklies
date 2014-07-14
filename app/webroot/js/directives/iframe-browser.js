app.directive("iframeBrowser", function(){
	return {
		restrict : "EA",
		templateUrl : "../templates/iframe-browser.html",
		controller : function($scope){

		},
		replace : true,
		scope: {
		    data : "=browserData"
		},
		link : function(scope, ele, attrs, ctrl, sce){
			scope.data.url = "";
		}
	}
});	