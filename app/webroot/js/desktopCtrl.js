'use strict';

goog.require('goog.math.Rect');
app.service("gridService", function($timeout){
	// Array.prototype.max = function() {
	// 	var max = this[0];
	// 	var len = this.length;
	// 	for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
	// 	return max;
	// }
	// Array.prototype.min = function() {
	// 	var min = this[0];
	// 	var len = this.length;
	// 	for (var i = 1; i < len; i++) if (this[i] < min) min = this[i];
	// 	return min;
	// }
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	var folders, links;
	var scrollWidth = 20;
	var sideWidth = 90;
	var topHeight = 90;
	var defaultGridWidth = 150;
	var bottomHeight = 20;
	var getRects = {
		folder : function(){
			var h = Math.ceil(getRowNum() / 4);
			var v = getColNum();
			var rects = [], rect;
			for(var i = 0; i<h; i++){
				for(var j = 0; j<v; j++){
					rect = new goog.math.Rect(
						j*(self.gridWidth + self.gridMargin),
						i*(self.folderHeight + self.gridMargin),
						self.gridWidth,
						self.folderHeight
					);
					rect.grid = [j, i];
					rects.push(rect);
				}
			}
			//console.log(rects);
			return rects;
		}, 
		link : function(){
			var h = getRowNum();
			var v = getColNum();
			var rects = [], rect;
			for(var i = 0; i<h; i++){
				for(var j = 0; j<v; j++){
					rect = new goog.math.Rect(
						j*(self.gridWidth + self.gridMargin),
						i*(self.gridHeight + self.gridMargin),
						self.linkWidth,
						self.gridHeight
					);
					rect.grid = [j, i];
					rects.push(rect);
				}
			}
			return rects;
		}
	}

	var getColNum = function(){
		var n = Math.ceil((self.boardWidth - self.gridMargin) / (self.gridWidth + self.gridMargin));
		return n;
	}

	var getRowNum = function(){
		var h = self.viewHeight - self.topHeight;
		var n = Math.floor((h - self.gridMargin) / (self.gridHeight + self.gridMargin));
		return n;
	}

	var getScrollbarWidth = function(){
		
		// var inner = document.createElement('p');
		// inner.style.width = "100%";
		// inner.style.height = "200px";

		// var outer = document.createElement('div');
		// outer.style.position = "absolute";
		// outer.style.top = "0px";
		// outer.style.left = "0px";
		// outer.style.visibility = "hidden";
		// outer.style.width = "200px";
		// outer.style.height = "150px";
		// outer.style.overflow = "hidden";
		// outer.appendChild (inner);

		// document.body.appendChild (outer);
		// var w1 = inner.offsetWidth;
		// outer.style.overflow = 'scroll';
		// var w2 = inner.offsetWidth;
		// if (w1 == w2) w2 = outer.clientWidth;

		// document.body.removeChild (outer);

		// return (w1 - w2);
	}

	var folderDistance = function(grid1, grid2){
		var dist = Math.abs(grid2[0] - grid1[0]) + Math.abs(grid2[1] - grid1[1]);
		//console.log(grid2 + "," + grid1 + " -> " + dist);
		return dist;
	}

	var getGrids = function(){
		var y = 0, x = 0, grids = [], col = getColNum();
		var w = (self.gridWidth + self.gridMargin), h = (self.gridHeight + self.gridMargin);
		while((y * h) <= self.viewHeight - h){
			grids.push([x, y]);
			x++;
			if(x >= col - 1){
				x = 0;
				y++;
			}
		}
		return grids;
	}

	var getFolderGrids = function(){
		var h = Math.ceil(getRowNum() / 4);
		var v = getColNum();
		var grids = [], grid;
		for(var i = 0; i<h; i++){
			for(var j = 0; j<v; j++){
				grid = [j, i];
				grids.push(grid);
			}
		}
		//console.log(rects);
		return grids;
	}

	this.sideWidth = sideWidth;
	this.topHeight = topHeight;
	this.bottomHeight = bottomHeight;
	this.hasScrollbar = function(){
		return $(window).height() > self.contentHeight ? false : true;
	}

	this.getGridWidth = function(){
		// console.log(self.boardWidth);
		var num = Math.ceil((self.boardWidth - self.gridMargin) / (defaultGridWidth + self.gridMargin));
		// console.log(num);
		var extra = self.boardWidth + self.gridMargin - (defaultGridWidth + self.gridMargin) * num;
		// console.log(extra);
		extra /= num;
		var w = defaultGridWidth + extra;
		// console.log(w);
		return w;
	}
	
	//this needs to be called after links and folders rendered
	this.getSreenHeight = function(){
		var wh = $(window).height();
		var h = wh , eh = 0;
		$(".folder, .link").each(function(i, e){
			eh = $(e).offset().top + $(e).height();
			if(h < eh){
				h = eh;
			}
		});
		return h;
	}

	this.getContentHeight = function(){
		var h = 0 , eh = 0;
		$(".folder, .link").each(function(i, e){
			eh = $(e).offset().top + $(e).height();
			if(h < eh){
				h = eh;
			}
		});
		return h;
	}

	this.getHLines = function(){
		var n = getRowNum();
		var a = [];
		for(var i = 0; i<n; i++)
			a.push({
				"top" : i * (self.gridHeight + self.gridMargin)
			});
		
		return a;
	}

	this.getVLines = function(){
		vlines = [];
		var n = getColNum();
		for(i = 0; i<n; i++)
			vlines.push({
				"index" : i
			});
		
		return vlines;
	}

	this.update = function(){

		//new height comes from dragged element exceeding viewport
		self.viewHeight = self.getSreenHeight();
		self.contentHeight = self.getContentHeight();
		self.viewWidth = self.hasScrollbar() ? $(window).width() - scrollWidth : $(window).width();
		self.boardHeight = self.viewHeight - self.topHeight - bottomHeight;
		self.boardWidth = self.viewWidth - 2 * self.sideWidth;
		self.gridWidth = self.getGridWidth();
		
		self.rows = getRowNum();
		self.cols = getColNum();
		self.folderHeight = 4*self.gridHeight + 3*self.gridMargin;
		self.linkWidth = 2*self.gridWidth + self.gridMargin;

		//require viewHeight
		self.hlines = self.getHLines();

		//require viewWidth
		self.vlines = self.getVLines();
		self.folderRects = getRects.folder();
		self.linkRects = getRects.link();
		self.grids = getGrids();
		self.folderGrids = getFolderGrids();
	}

	this.getRect = function($target){
		var offset = $target.position();
		return new goog.math.Rect(offset.left, offset.top, $target.width(), $target.height());
	}

	this.outOfBoundry = function($ele){
		return $ele.position().left + $ele.width() > $(window).width();
	}

	this.occupied = {
		folder : function(grid){
			folders = self.folders;
			links = self.links;
			for(var i = 0; i<folders.length; i++){
				if(goog.array.equals(folders[i].grid, grid)){
					return true;
				}
			}
			var rect1, rect2 = self.gridToRect.folder(grid);
			for(var i = 0; i<links.length; i++){
				rect1 = self.gridToRect.link(links[i].grid);
				if(rect1.intersects(rect2))
					return true;
			}
			return false;
		},
		link : function(grid){
			var links = self.links;
			for(var i = 0; i<links.length; i++){
				if(goog.array.equals(links[i].grid, grid))
					return true;
			}
			return false;
		}
	}

	this.findSelectedGrid = {
		folder : function(originGrid, draggingRect){
			//find in all available rects, which has most intersection
			var folderRects = self.folderRects, rect, intersection, area, max = {area : 0, grid : undefined};
			var linkRects = self.linkRects;
			var occupied; 
			for(var i = 0; i<folderRects.length; i++){
				rect = folderRects[i];
				//if(rect.intersects(draggingRect) && (!goog.math.Rect.equals(originRect, rect))){
				if(rect.intersects(draggingRect) && (!goog.array.equals(rect.grid, originGrid))){	
					intersection = goog.math.Rect.intersection(rect, draggingRect);
					area = intersection.width * intersection.height;
					if(area > max.area){
						max.area = area;
						max.grid = rect.grid;
					}
				}
			}
			return max.grid;
		},
		link :function(originGrid, draggingRect){
			//find in all available rects, which has most intersection
			var rect, intersection, area, max = {area : 0, grid : undefined};
			var linkRects = self.linkRects;
			var occupied; 
			for(var i = 0; i<linkRects.length; i++){
				rect = linkRects[i];
				if(rect.intersects(draggingRect) && (!goog.array.equals(rect.grid, originGrid))){
					intersection = goog.math.Rect.intersection(rect, draggingRect);
					area = intersection.width * intersection.height;
					if(area > max.area){
						max.area = area;
						max.grid = rect.grid;
					}
				}
			}
			return max.grid;
		}
	}

	this.gridToRect = {
		folder :function(grid){
			var rect = new goog.math.Rect(
				grid[0] * (self.gridWidth + self.gridMargin),
				grid[1] * (self.gridHeight + self.gridMargin) * 4 ,
				self.gridWidth,
				self.folderHeight
			);
			return rect;
		},
		link : function(grid){
			var rect = new goog.math.Rect(
				grid[0] * (self.gridWidth + self.gridMargin),
				grid[1] * (self.gridHeight + self.gridMargin),
				self.linkWidth,
				self.gridHeight
			);
			return rect;
		}
	}

	this.rectToGrid = function(rect){

	}

	this.findNearistGrid = {
		folder : function(grid){
			var folderGrids = self.folderGrids, folderGrid, availableGrids = [], distances = [], bool;
			for(var i = 0; i<folderGrids.length; i++){
				folderGrid = folderGrids[i];
				bool = self.occupied.folder(folderGrid);
				//console.log(folderGrid, bool);
				if(!bool){
					folderGrid.distance = folderDistance(folderGrid, grid);
					availableGrids.push(folderGrid);
				}
			}
			//sort by distance
			var min = availableGrids.sort(function(a, b){
				if(a.distance > b.distance)
					return 1;
				else if(a.distance < b.distance)
					return -1;
				return 0;
			});

			//get only nearests
			min = (function(){
				var last = min[0].distance, arr = [], i = 0;
				while(min[i].distance === last){
					arr.push(min[i]);
					i++;
				}
				return arr;
			})();


			//left greater than right, top greater than bottom
			min.sort(function(a, b){
				if(a[0] > b[0])
					return 1
				else if(a[1] > b[1])
					return 1
				else return -1;
			});

			return min[0];
		},
		link : function(grid){

		}
	}

	this.findNextGrid = {
		folder : function(){

		},
		link : function(){

		}
	}

	this.updateOverFlow = function(bottom){
		bottom += topHeight;
		if(bottom > this.viewHeight){
			this.update();
		}
	}

	this.init = function(folders, links){

		this.folders = folders;
		this.links = links;
		self.gridHeight = 30;
		self.gridMargin = 10;

		this.update();
		// this.folderRects = getRects.folder();
		// this.linkRects = getRects.link();
	}
})
.controller("desktopCtrl", function($scope, $timeout, gridService, keyboardManager){
	var links = [], folders = [], $allElements;
	var lastDragged;
	var timeout;
	var pushedX, pushedY;
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

		// folders.push({
		// 	id : "folder-" + (7),
		// 	type : i % 2 === 0 ? "" : "youtube",
		// 	name : "test folder",
		// 	grid : [0, 7],
		// 	state : ""
		// });


		$(window).resize(function(){
			//lazy call
			clearTimeout(timeout);
			timeout = $timeout(function(){
				gridService.update();
				var folders = $scope.folders;
				var cols = gridService.cols;
				
				// $(".folder").each(function(i, e){
				// 	if(gs.outOfBoundry($(e))){
				// 		var newGrid = gs.findNearistGrid.folder(folders[i].grid);
				// 		$scope.folders[i].grid = newGrid;
				// 		console.log(newGrid);
				// 	}
				// });

			}, 500);
		});

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

	$scope.showMenu = function(){
		alert("show menu");
		return false;
	}

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
})
.directive("folderDirective", function(gridService){
	return function($scope, ele, attrs){
		var timeout;
		var originRect, originGrid, draggingRect, selectedGrid, $folder, $link;
		var gs = gridService;
		var sideWidth = gs.sideWidth;
		$(ele).draggable({
			containment : "#desktop-view",
			scroll: false,
			start : function(e, ui){
				originRect = gs.getRect($(ele));
				selectedGrid = undefined;
				$folder = $(ele);
				originGrid = JSON.parse($folder.attr("data-grid"));
			},
			drag : function(e, ui){

				draggingRect = gs.getRect($folder);
				selectedGrid = gs.findSelectedGrid.folder(originGrid, draggingRect);
				if(selectedGrid !== undefined && !gs.occupied.folder(selectedGrid)){
					$scope.showDragPreview(selectedGrid, "folder");
				}else{
					$scope.hideDragPreview("folder");
				}
			},
			stop : function(e, ui){

				//hide the dragging preview div
				$scope.hideDragPreview("folder");
				
				//get rect by current dom position
				draggingRect = gs.getRect($folder);

				//find selected grid, if current position is original grid, return undefined
				selectedGrid = gs.findSelectedGrid.folder(originGrid, draggingRect);
				
				//if there is a selected grid and the selected grid is not occupied
				if(selectedGrid !== undefined && !gs.occupied.folder(selectedGrid)){

					//find the model by dom id
					for(var i = 0; i<$scope.folders.length; i ++){
						if($scope.folders[i].id == $folder.attr("id")){
							$scope.folders[i].grid = selectedGrid;
						}
					}
				}else{
					$folder.animate({
						left : originRect.left,
						top : originRect.top
					}, 200);
				}
				
				$scope.$apply();

				//var near = gs.findNearistGrid.folder(selectedGrid);
			}
		});
	}
})
.directive("linkDirective", function(gridService){
	return function($scope, ele, attrs){
		var gs = gridService;
		var originRect, originGrid, draggingRect, selectedGrid, $folder, $link;
		var sideWidth = gs.sideWidth;
		$(ele).draggable({
			containment : "body",
			scroll: false,
			start : function(e, ui){
				$link = $(ele);
				originRect = gs.getRect($link);
				selectedGrid = undefined;
				originGrid = JSON.parse($link.attr("data-grid"));
			},
			drag : function(e, ui){

				draggingRect = gs.getRect($link);
				selectedGrid = gs.findSelectedGrid.link(originRect, draggingRect);
				if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
					$scope.showDragPreview(selectedGrid, "link");
				}else{
					$scope.hideDragPreview("link");
				}
			},
			stop : function(e, ui){

				//check if element exceeds bottom boundry and update
				gs.updateOverFlow(ui.position.top + $(ele).height());

				//hide the dragging preview div
				$scope.hideDragPreview("link");
				
				//get rect by current dom position
				draggingRect = gs.getRect($link);
				//find selected grid, if current position is original grid, return undefined
				selectedGrid = gs.findSelectedGrid.link(originGrid, draggingRect);
				
				//if there is a selected grid and the selected grid is not occupied
				if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){

					//find the model by dom id
					for(var i = 0; i<$scope.links.length; i ++){
						if($scope.links[i].id == $link.attr("id")){
							$scope.links[i].grid = selectedGrid;
							$scope.$apply();
						}
					}
				}else{
					$link.animate({
						left : originRect.left,
						top : originRect.top
					}, 200);
				}
			}
		});
	}
});

