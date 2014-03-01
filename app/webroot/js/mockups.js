var app = angular.module("mk", ['ngRoute'], function($httpProvider){

});
app.controller("mockupsCtrl", function($scope, apiService){
	var service = apiService.linkService;
	var _try = function(data){var a;try{a = JSON.parse(data);}catch(e){return {};}return a;}
	service.get(542).then(function(link){
		_c.log(link);
		link.state = {
			name : "ready"
		}
		link.grid = link.grid.split(",");
		link.grid = [parseInt(link.grid[0], 10), parseInt(link.grid[1], 10)];
		link.meta = _try(link.meta);
		link.type = _try(link.type);
		$scope.$apply(function(){
			$scope.results = link.type.results;
		});
	});
});