app.controller("linkPopupCtrl", function($scope){

	var $imgContainer = $('.link-popup .edit .imgs'),
		$selectedImg = $imgContainer.find("img").eq(0),
		borderSize = 10;

	$scope.$watch('selectedImg', function() {
		var img = $scope.selectedImg;
		if(img){
			$(".selected-border").css({
		   		left : img.position().left,
		   		top : img.position().top + $imgContainer.scrollTop(),
		   		width : img.width() - 2*borderSize,
		   		height : img.height() - 2*borderSize
		   	});
		}
	});

	$selectedImg.load(function(){
		$scope.$apply(function(){
			$scope.selectedImg = $selectedImg;
		});
	});

	$scope.onImgClick = function(e){
		$scope.selectedImg = $(e.currentTarget);
	}
});