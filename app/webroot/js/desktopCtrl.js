'use strict';

/*
var pushAction = function(){

	this.evtTarget;
	this.pushTarget;
	this.restoreEvent = "collapes";
	this.restoreGrid; //original grid
	this.direction; //string x, -x, y, -y;
	this.distance; //number of grid

}

var w = lastWidth - currentWidth;
folders = gs.getOutBoundElements();
for(var i = 0; i<folders.length; i++){
	folder = folders[i];
	newGrid = gs.findNearestGrid(folder);
	resizeManager.when(w, function(){
		folder.grid = folder.grid;
	});
	folder.grid = newGrid;
}

var reposAction = function(resizeManager){

	var self = this;
	this.evtTarget;
	this.pushTarget;
	this.restoreGrid = [4, 5]; //original grid
	this.push = [3, -3]; // x + 3, y - 3

	resizeManager.watchSizeUp("width", 1000, this);
}*/

goog.require('goog.math.Rect');

app.controller("desktopCtrl", function($scope, $timeout, gridService, keyboardManager, resizeService){
	var links = [], folders = [], $allElements;
	var lastDragged;
	var timeout;
	var pushedX, pushedY;
	var rs = resizeService;
	var gs = gridService;
	var sideWidth = gs.sideWidth;
	var init = function(){
		for(var i = 0; i<6; i++){
			links.push({
				id : "link-" + (i+1),
				grid : [0, 4+i],
				pageTitle : "Nina Simone - Feeling good (Nicolas Jaar edit) \"Nico's feeling Good\" - YouTube",
				thumb : "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQBdfgUT1fJTToGl&w=398&h=208&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FBkzvSf9NLTY%2Fhqdefault.jpg&cfs=1&upscale",
				contentTitle : "Nicolas Jaar - Sonar 2012 (full set)",
				from : "www.youtube.com",
				desc : "THIS IS THE FIRST 11 MINUTES OF THE DARKSIDE ALBUM. FOOTAGE WAS FILMED IN MONTICELLO, NY. RECORD WAS WRITTEN AND RECORDED AT OTHER PEOPLE STUDIOS, NY, STUDIO DE LA REINE, PARIS & THE BARN, GARRISON, NY."
			});

			folders.push({
				id : "folder-" + (i+1),
				type : i % 2 === 0 ? "" : "youtube",
				name : "Lorem ipsum dolor sit amet sit amet Lorem",
				grid : [i, 0],
				state : ""
			});
		}

		var onSizeChange = function(){
			//gs.update();
		}
		var onSizeDown = function(evt, lastWidth){
			var folders = $scope.folders, folder, grid, rect, dist, newGrid;
			var cols = gs.cols;

			gs.update($scope.folders, $scope.links);

			//lastWidth = $(window).width();
			for(var i = folders.length - 1; i>-1; i--){

				gs.update($scope.folders, $scope.links);

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
					$scope.folders[i].grid = newGrid;
				}
			}
			$scope.$apply();
			gs.update($scope.folders, $scope.links);
		}

		$(rs).on("sizeChange", onSizeDown);
		//$(rs).on("sizeDown", onSizeDown);

		keyboardManager.bind("ctrl+l", function(){
			$scope.showGrid = !$scope.showGrid;
			$scope.$apply();
		});

		//wait for folder directive construction
		$timeout(function(){
			gridService.update();
		}, 100);
	}

	init();

	$scope.links = links;
	$scope.folders = folders;
	$scope.grid = gridService;
	$scope.folderPreviewGrid = [2, 1];
	$scope.showFolderPreview = false;
	$scope.linkPreviewGrid = [3, 4];
	$scope.showLinkPreview = false;
	$scope.showGrid = false;

	gridService.init(folders, links);

	// $scope.showMenu = function(){
	// 	alert("show menu");
	// 	return false;
	// }

	$scope.getDesktopStyle = function(){
		var hasScrollbar = gridService.hasScrollbar();
		if(hasScrollbar){
			return {height : gridService.viewHeight + 20}
		}else{
			return {height : gridService.viewHeight}
		}
	}

	$scope.gridClass = function(){
		return $scope.showGrid ? "shawGrid" : "hideGrid";
	}

	$scope.getLinkStyle = function(link){
		
		return {
			left : link.grid[0] * (gridService.gridWidth + gridService.gridMargin),
			top : link.grid[1] * (gridService.gridHeight + gridService.gridMargin),
			height : gridService.gridHeight,
			width : gridService.linkWidth
		}
	}

	$scope.getFolderStyle = function(folder){
		return {
			left : folder.grid[0] * (gridService.gridWidth + gridService.gridMargin),
			top : folder.grid[1] * (gridService.gridHeight+ gridService.gridMargin) * 4,
			width : gridService.gridWidth,
			height : gridService.folderHeight
		}
	}

	$scope.showDragPreview = function(selectedGrid, type){
		if(type === "folder"){
			$scope.folderPreviewGrid = selectedGrid;
			$scope.showFolderPreview = true;
		}else{
			$scope.linkPreviewGrid = selectedGrid;
			$scope.showLinkPreview = true;
		}
		$scope.$apply();
	}

	$scope.hideDragPreview = function(type){
		if(type === "folder"){
			$scope.showFolderPreview = false;
		}else{
			$scope.showLinkPreview = false;
		}
		$scope.$apply();
	}
});


