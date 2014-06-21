'use strict';
app.controller("popupCtrl", function($scope, $rootScope, apiService){

	$scope.show = false;
	
	var $holder = $("#popup-holder"),
		$imgContainer,
		$selectedImg,
		$hoverImg = false,
		$delBtn,
		$imgBorder,
		$pd = $.Deferred(),
		popup = {},
		borderSize = 10,
		link,
		thumbIndex;

	popup.ready = function(){
		return $pd.promise();
	}

	popup.init = function(){
		
		$imgContainer = $holder.find('.edit .imgs');
		$delBtn  = $imgContainer.find(".btn-del");
		$imgBorder = $imgContainer.find(".selected-border");

		//** hide border
		$imgBorder.hide();

		//** give it some time to render
		setTimeout(function(){
			$selectedImg = $imgContainer.find("img").eq($scope.link.thumbIndex);
			//** set selectedImg, selectedImg is watched
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

	$scope.$watch('selectedImg', function() {
		var $img = $scope.selectedImg;

		if($img !== undefined && $img.length === 1){
			$imgBorder.show().css({
		   		left : $img.position().left,
		   		top : $img.position().top + $imgContainer.scrollTop(),
		   		width : $img.width() - 2*borderSize + 2,
		   		height : $img.height() - 2*borderSize + 2
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
		// console.log(data);
		if(data.images.length === 1 && data.images[0].length === 0)
			data.images = [];

		$scope.link = data;
		$scope.show = true;
		$scope.tab = tab;
		$scope.popupUrl = "templates/popup-link.html";

		//** load template if not already, init if loaded
		popup.ready().then(popup.init);
	});

	$rootScope.$on("hidePopup", function(e){
		//** reset scope variables
		$scope.show = false;
		$scope.tab = "edit";
		$scope.selectedImg = undefined;
		$scope.link = null;

		//** reset variables
		$hoverImg = false;
		$imgBorder.hide();
	});

	$scope.tab = "edit";
	$scope.shared = false;
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
		$pd.resolve();
	}

	$scope.onPopupClose = function(){
		$scope.show = false;
	}
});