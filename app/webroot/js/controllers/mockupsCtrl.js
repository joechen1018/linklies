var app = angular.module("mk", ['ngRoute'], function($httpProvider){

});
app.controller("mockupsCtrl", function($scope, apiService){
	var service = apiService.linkService;
	var _try = function(data){var a;try{a = JSON.parse(data);}catch(e){return {};}return a;}

	$scope.browserData = {
		url : "http://www.catswhocode.com/blog/10-awesome-things-to-do-with-curl"
	}


	$.get(root + "api/fetchAll/link/joe.chen.1", function(res){
		var arr = res.data;
		for(var i = 0; i<arr.length; i++){
			arr[i] = arr[i]["Link"];
		}
		console.log(arr);
		$scope.$apply(function(){
			$scope.linkList = arr;
		});
	});
	/*
	service.get(626).then(function(link){
		_c.log(data);
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
	*/
});