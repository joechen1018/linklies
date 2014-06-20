'use strict';
app.controller("popupCtrl", function($scope, $rootScope, apiService){

	$scope.show = false;
	
	var $holder = $("#popup-holder"),
		$imgContainer,
		$selectedImg,
		$hoverImg = false,
		$delBtn,
		borderSize = 10,
		link,
		thumbIndex;

	$scope.$watch('selectedImg', function() {
		var img = $scope.selectedImg;
		if(img !== undefined && img.length === 1){
			$(".selected-border").show().css({
		   		left : img.position().left,
		   		top : img.position().top + $imgContainer.scrollTop(),
		   		width : img.width() - 2*borderSize + 2,
		   		height : img.height() - 2*borderSize + 2
		   	});
		}
	});

	//** prevent parent element scroll
	$holder.on("mousewheel", ".link-popup .edit .imgs", function(e){
		$(this).mousewheelStopPropagation();
	});

	//** handle mouseenter event on img
	$holder.on("mouseenter", ".link-popup .edit img", function(e){

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

	//** handle mouseleave event on img
	$holder.on("mouseleave", ".link-popup .edit img", function(e){
		$scope.$apply(function(){
			$scope.hoverImg = false;
		});
	});

	$rootScope.$on("showPopup", function(e, tab, data){
		$scope.link = data;
		$scope.show = true;
		$scope.tag = tab;
		$scope.popupUrl = "templates/popup-link.html";
	});

	$rootScope.$on("hidePopup", function(e){
		$scope.show = false;
		$scope.tab = "edit";
	});

	$scope.tab = "edit";
	$scope.shared = true;
	$scope.hoverImg = false;
	$scope.onImgClick = function(e){
		$selectedImg = $(e.currentTarget);
		$scope.selectedImg = $selectedImg;
		thumbIndex = $imgContainer.find("img").index($selectedImg);
		$scope.link.thumbIndex = thumbIndex;
		
		apiService.linkService.save($scope.link).then(function(){
			$rootScope.$broadcast("linkUpdated", $scope.link);
		});
	}
	$scope.deleteHoverdImg = function(){

	}

	$scope.onPopupLoaded = function(){

		$imgContainer = $holder.find('.edit .imgs');
		$delBtn  = $imgContainer.find(".btn-del");

		//** give it some time to render
		setTimeout(function(){
			$selectedImg = $imgContainer.find("img").eq($scope.link.thumbIndex);
			if($selectedImg.width() > 0 && $selectedImg.height() > 0){
				$scope.selectedImg = $selectedImg;
			}else{
				$selectedImg.load(function(){
					$scope.$apply(function(){
						$scope.selectedImg = $selectedImg;
					});
				});
			}
		}, 100);
	}

	$scope.onPopupClose = function(){
		$scope.show = false;
	}
});