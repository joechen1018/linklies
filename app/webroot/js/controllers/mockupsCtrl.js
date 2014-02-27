goog.require('goog.math.Rect');
var app = angular.module("mk", ["ngRoute"], function($httpProvider){
});

app.controller("mockupsCtrl", function($scope, apiService){
	var service = apiService.linkService;
	var _try = function(data){var a;try{a = JSON.parse(data);}catch(e){return {};}return a;}
	service.get(256).then(function(link){
		//_c.log(data);
		link.state = {
			name : "ready"
		}
		link.grid = link.grid.split(",");
		link.grid = [parseInt(link.grid[0], 10), parseInt(link.grid[1], 10)];
		link.meta = _try(link.meta);
		$scope.$apply(function(){
			$scope.links = [link];
		});
	});
});