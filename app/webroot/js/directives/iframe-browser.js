app.directive("iframeBrowser", function($rootScope, popupData){
	return {
		restrict : "EA",
		templateUrl : root + "templates/iframe-browser.html",
		controller : function($scope){

		},
		replace : true,
		link : function(scope, ele, attrs, ctrl){

			scope.data = popupData.browser;
			var $browser = $(".iframe-browser"),
				$holder = $browser.find(".iframe-holder");

			scope.data.fullscreen = false;
			scope.gotoFullscreen = function(){
				scope.data.fullscreen = true;
				$holder.animate({
					left : 0,
					width : "100%"
				}, 300);
			}

			scope.escapeFullscreen = function(){
				scope.data.fullscreen = false;
				$holder.animate({
					left : "10%",
					width : "80%"
				}, 300);
			}

			scope.closeBrowser = function(){
				scope.data.show = false;
				popupData.show = false;
			}

			scope.refresh = function(){
				var url = scope.data.url;
				scope.data.url = "";
				setTimeout(function(){
					scope.data.url = url;
				}, 10);
			}
		}
	}
});	