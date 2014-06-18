app.controller("linkPopupCtrl", function($scope){

	var $imgContainer = $('.link-popup .edit .imgs'),
		$selectedImg = $imgContainer.find("img").eq(0),
		borderSize = 10, 
		$hoverImg = false,
		$delBtn = $imgContainer.find(".btn-del");

	$scope.$watch('selectedImg', function() {
		var img = $scope.selectedImg;
		if(img){
			$(".selected-border").css({
		   		left : img.position().left,
		   		top : img.position().top + $imgContainer.scrollTop(),
		   		width : img.width() - 2*borderSize + 2,
		   		height : img.height() - 2*borderSize + 2
		   	});
		}
	});

	$selectedImg.load(function(){	
		$scope.$apply(function(){
			$scope.selectedImg = $selectedImg;
		});
	});

	$imgContainer.on("mouseenter", "img", function(){
		$hoverImg = $(this);
		$scope.$apply(function(){
			if($hoverImg == $selectedImg){
				$scope.hoverImg = false;
			}else{
				$scope.hoverImg = $hoverImg;
			}
		});
		$delBtn.css({
			left : $hoverImg.position().left + $hoverImg.width() - $delBtn.width(),
			top : $hoverImg.position().top + $imgContainer.scrollTop()
		});
	});

	$imgContainer.on("mouseleave", "img", function(){
		$scope.$apply(function(){
			$scope.hoverImg = false;
		});
	});

	$scope.tab = "edit";
	$scope.shared = true;
	$scope.hoverImg = false;
	$scope.onImgClick = function(e){
		$selectedImg = $(e.currentTarget);
		$scope.selectedImg = $selectedImg;
	}
	$scope.deleteHoverdImg = function(){

	}
});