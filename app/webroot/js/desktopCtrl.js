'use strict';

goog.require('goog.math.Rect');
app.service("gridService", function($timeout){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	var folders, links;
	var scrollWidth = 20;
	var getRects = {
		folder : function(){
			var h = Math.ceil(getHGridNum() / 4);
			var v = getVGridNum();
			var rects = [], rect;
			for(var i = 0; i<h; i++){
				for(var j = 0; j<v; j++){
					rect = new goog.math.Rect(
						20 + j*(self.gridWidth + self.gridMargin),
						20 + i*(self.folderHeight + self.gridMargin),
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
			var h = getHGridNum();
			var v = getVisibleVGridNum();
			var rects = [], rect;
			for(var i = 0; i<h; i++){
				for(var j = 0; j<v; j++){
					rect = new goog.math.Rect(
						20 + j*(self.gridWidth + self.gridMargin),
						20 + i*(self.gridHeight + self.gridMargin),
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

	var getHGridNum = function(){
		var h = self.viewHeight;
		return Math.ceil((h - 40 - self.gridMargin) / (self.gridHeight + self.gridMargin));
	}

	var getVGridNum = function(){
		return Math.ceil(self.viewWidth / (self.gridWidth + self.gridMargin));
	}

	var getVisibleVGridNum = function(){
		return Math.floor(($(window).width() - 40) / (self.gridWidth + self.gridMargin));
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

	this.hasScrollbar = function(){
		return $(window).height() > self.contentHeight ? false : true;
	}

	this.getGridWidth = function(){
		var bool = this.hasScrollbar();
		var viewportWidth = bool ? self.viewWidth - 10 : self.viewWidth - 30;
		var num = Math.floor(viewportWidth/160);
		var extra = Math.round((viewportWidth - num*160)/num);
		return 150 + extra;
	}
	
	//this needs to be called after links and folders rendered
	this.getViewHeight = function(){
		var wh = $(window).height()
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
		var h = self.viewHeight;
		var n = Math.ceil((h - self.gridMargin) / (self.gridHeight + self.gridMargin));
		var a = [];
		for(var i = 0; i<n; i++)
			a.push({i : i});
		
		return a;
	}

	this.getVLines = function(){
		vlines = [];
		var n = Math.ceil(self.viewWidth / (self.gridWidth + self.gridMargin)) + 1;
		for(i = 0; i<n; i++)
			vlines.push({"i" : i});
		
		return vlines;
	}

	this.update = function(){

		//new height comes from dragged element exceeding viewport
		self.viewHeight = self.getViewHeight();
		self.contentHeight = self.getContentHeight();
		self.viewWidth = self.hasScrollbar() ? $(window).width() - scrollWidth : $(window).width();
		self.gridWidth = self.getGridWidth();
		self.folderHeight = 4*self.gridHeight + 3*self.gridMargin;
		self.linkWidth = 2*self.gridWidth + self.gridMargin;

		//require viewHeight
		self.hlines = self.getHLines();

		//require viewWidth
		self.vlines = self.getVLines();
		self.folderRects = getRects.folder();
		self.linkRects = getRects.link();
	}

	this.getRect = function($target){
		var offset = $target.offset();
		return new goog.math.Rect(offset.left, offset.top, $target.width(), $target.height());
	}

	this.reposition = function(){
	}

	this.outOfBoundry = function($ele){
		return $ele.offset().left + $ele.width() > $(window).width();
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
				20 + grid[0] * (self.gridWidth + self.gridMargin),
				20 + grid[1] * (self.gridHeight + self.gridMargin) * 4 ,
				self.gridWidth,
				self.folderHeight
			);
			return rect;
		},
		link : function(grid){
			var rect = new goog.math.Rect(
				20 + grid[0] * (self.gridWidth + self.gridMargin),
				grid[1] * (self.gridHeight + self.gridMargin) + 20,
				self.linkWidth,
				self.gridHeight
			);
			return rect;
		}
	}

	this.updateOverFlow = function(bottom){
		bottom += 20;
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
				name : "test folder",
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
			}, 100);
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
			left : 20 + link.grid[0] * (gridService.gridWidth + gridService.gridMargin),
			top : link.grid[1] * (gridService.gridHeight + gridService.gridMargin) + 20,
			height : gridService.gridHeight,
			width : gridService.linkWidth
		}
	}

	$scope.getFolderStyle = function(folder){
		return {
			left : 20 + folder.grid[0] * (gridService.gridWidth + gridService.gridMargin),
			top : 20 + folder.grid[1] * (gridService.gridHeight+ gridService.gridMargin) * 4 ,
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
			}
		});
	}
})
.directive("linkDirective", function(gridService){
	return function($scope, ele, attrs){
		var gs = gridService;
		var originRect, originGrid, draggingRect, selectedGrid, $folder, $link;

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

