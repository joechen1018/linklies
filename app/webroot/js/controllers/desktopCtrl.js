'use strict';

goog.require('goog.math.Rect');
app.controller("desktopCtrl", function($scope, $timeout, gridService, keyboardManager, resize, gridSystem, gridRects, apiService){

	var $allElements;
	var timeout;
	var rs = resize;
	var gs = gridService;
	var sideWidth = gs.sideWidth;
	var init = function(){

		var onSizeChange = function(){
			gs.update();
		}
		var onSizeDown = function(evt, lastWidth){
			/*var folders = $scope.folders, folder, grid, rect, dist, newGrid;
			var cols = gs.cols;

			//gs.update($scope.folders, $scope.links);

			//lastWidth = $(window).width();
			for(var i = folders.length - 1; i>-1; i--){

				folder = folders[i];
				grid = folder.grid;
				rect = gs.gridToRect.folder(grid);
				dist = 1 * gs.sideWidth + rect.left + rect.width;
				//lastWidth = $(window).width();
				if($(window).width() <= dist + 2 * gs.sideWidth){

					rs.whenWidthGreater(dist, i, grid).then(function(index, grid){
						$scope.$apply(function(){
							$scope.folders[index].grid = grid;
						});
					});

					newGrid = gs.findNextGrid.folder(grid, i);
					//console.log(newGrid, i);
					$scope.folders[i].grid = newGrid;
				}
			}*/
			$scope.$apply();
			//gs.update();
		}

		$(rs).on("sizeChange", onSizeDown);
		//$(rs).on("sizeDown", onSizeDown);

		keyboardManager.bind("ctrl+l", function(){
			$scope.showGrid = !$scope.showGrid;
			$scope.$apply();
		});

		gridService.update();
	}

	init();

	$scope.links = gridRects.links;
	$scope.folders = gridRects.folders.then(function(folders){
		$scope.folders = gridRects.folders;
	});
	$scope.grid = gridService;
	$scope.resize = resize;
	$scope.grids = gridSystem;
	$scope.showGrid = false;
	$scope.dragPreview = {
		folder : {
			grid : [0, 0],
			show : false
		},
		link : {
			grid : [0,0],
			show : false
		}
	};
	$scope.show = true;
	//gs.init($scope.folders, $scope.links);

	$scope.$watch('grid.gridWidth', function(newVal, oldVal, scope){
		// console.log(newVal);
		// console.log(oldVal);
	});

	$scope.$watch("gridRects.folders", function(newVal, oldVal){
		//$scope.folders = newVal;
	});

	$scope.$watch('resize.size', function(newSize, oldSize){
		// console.log(newVal);
		// console.log(oldVal);
		gridSystem.onResize(newSize);
	}, true);

	$scope.getDesktopStyle = function(){
		var hasScrollbar = gridService.hasScrollbar();
		if(hasScrollbar){
			return {
				height : gridService.viewHeight + 20,
				display : $scope.show ? "block" : "none"
			}
		}else{
			return {
				height : gridService.viewHeight,
				display : $scope.show ? "block" : "none"
			}
		}
	}
});
