app.controller("devCtrl", function($scope, resize, $interval){

	$scope.obj = {};
	$scope.obj.a = 25;
	$scope.obj.b = 39;
	$scope.result = $scope.obj.a + $scope.obj.b;

	$interval(function(){
		$scope.obj.a ++;
		//$scope.$apply();
	}, 3000);

	// $scope.$watch("obj", function(newVal){
	// 	console.log(newVal);
	// }, true);
});