'use strict';

goog.require('goog.math.Rect');
app.service("gridService", function($timeout){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	var folders, links;
	var getFolderRects = function(){
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
	}

	var getLinksRects = function(){
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
		if($(window).height() >= self.getViewHeight()){
			return 0;
		}
		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild (outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild (outer);

		return (w1 - w2);
	}

	this.getGridWidth = function(){
		var viewportWidth = $(window).width() - 30 - getScrollbarWidth();
		var num = Math.floor(viewportWidth/160);
		var extra = viewportWidth - num*160;
		return Math.round(150 + (extra/num));
	}
	
	//this needs to be called after links and folders rendered
	this.getViewHeight = function(){
		var h = $("body").height() , eh = 0;
		$(".folder, .link").each(function(i, e){
			eh = $(e).offset().top + $(e).height();
			if(h < eh){
				h = eh;
			}
		});
		return h;
	}

	this.setViewHeight = function(h){
		self.viewHeight = h + 20;
	}

	this.getHLines = function(){
		var h = self.viewHeight;
		var n = Math.ceil((h - 40 - self.gridMargin) / (self.gridHeight + self.gridMargin));
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

		self.gridWidth = self.getGridWidth();
		self.folderHeight = 4*self.gridHeight + 3*self.gridMargin;
		self.linkWidth = 2*self.gridWidth + self.gridMargin;

		//new height comes from dragged element exceeding viewport
		self.viewHeight = self.newViewHeight || self.getViewHeight();
		self.viewWidth = $(window).width() - getScrollbarWidth();
		self.newViewHeight = false;

		self.hlines = self.getHLines();
		self.vlines = self.getVLines();
		self.folderRects = getFolderRects();
		self.linkRects = getLinksRects();
	}

	this.getRect = function($target){
		var offset = $target.offset();
		return new goog.math.Rect(offset.left, offset.top, $target.width(), $target.height());
	}

	this.pushForward = function($ele){
		// var grid = $ele.attr("data-grid"), rect;
		console.debug(grid.vlines.length);
		var vline = 3;
		if(isFolder($ele)){
			if(pushedX >= vline){
				pushedY++;
				pushedX = 0;
			}else{
				pushedX++;
			}
		}
		console.log([pushedX, pushedY]);
		rect = folderGridToRect([pushedX, pushedY]);
		$ele.css({
			left : rect.left,
			top : rect.top
		});
	}

	this.overlayByPrev = function($prev, $current){
		return false;
	}
	
	this.reposition = function(){
		var last;
		var all = $(".folder, .link");
		pushedX = 3; 
		pushedY = 0;
		all.each(function(i, e){
			if(i !== 0){
				if(overlayByPrev($(last), $(e))){
					pushForward($(e));
				}
			}
			if(outOfBoundry($(e))){
				pushForward($(e));
			}
			last = e;
		});
	}

	this.isFolder = function($ele){
		return $ele.attr("id").indexOf("folder") !== -1;
	}

	this.outOfBoundry = function($ele){
		return $ele.offset().left + $ele.width() > $(window).width();
	}
	
	this.linkGridInFolderGrid = function(linkGrid, folderGrid){
		var linkRect = new goog.math.Rect();
	}

	this.folderOccupied = function(grid){
		folders = this.folders;
		links = this.links;
		for(var i = 0; i<folders.length; i++){
			if(goog.array.equals(folders[i].grid, grid)){
				return true;
			}
		}
		var rect1, rect2 = this.folderGridToRect(grid);
		for(var i = 0; i<links.length; i++){
			rect1 = this.linkGridToRect(links[i].grid);
			if(rect1.intersects(rect2))
				return true;
		}
		return false;
	}
	
	this.isOriginalGrid = function($folder, grid){
		for(var i = 0; i<folders.length; i++){
			if(folders[i].id === $folder.attr("id")){
				if(goog.array.equals(folders[i].grid,grid)){
					return true;
				}
			}
		}
		return false;
	}

	this.findSelectedFolderGrid = function(originRect, draggingRect){
		//find in all available rects, which has most intersection
		var folderRects = this.folderRects, rect, intersection, area, max = {area : 0, grid : undefined};
		var linkRects = this.linkRects;
		var occupied; 

		for(var i = 0; i<folderRects.length; i++){
			rect = folderRects[i];
			if(rect.intersects(draggingRect) && (!goog.math.Rect.equals(originRect, rect))){
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

	this.findSelectedLinkGrid = function(originRect, draggingRect){
		//find in all available rects, which has most intersection
		var rect, intersection, area, max = {area : 0, grid : undefined};
		var linkRects = this.linkRects;
		var occupied; 
		for(var i = 0; i<linkRects.length; i++){
			rect = linkRects[i];
			if(rect.intersects(draggingRect)){
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


	this.folderGridToRect = function(folderGrid){
		var rect = new goog.math.Rect(
			20 + folderGrid[0] * (this.gridWidth + this.gridMargin),
			20 + folderGrid[1] * (this.gridHeight + this.gridMargin) * 4 ,
			this.gridWidth,
			this.folderHeight
		);
		return rect;
	}

	this.linkGridToRect = function(linkGrid){
		var rect = new goog.math.Rect(
			20 + linkGrid[0] * (this.gridWidth + this.gridMargin),
			linkGrid[1] * (this.gridHeight + this.gridMargin) + 20,
			this.linkWidth,
			this.gridHeight
		);
		return rect;
	}
	this.init = function(folders, links){

		this.folders = folders;
		this.links = links;
		self.gridHeight = 30;
		self.gridMargin = 10;

		this.update();

		// this.folderRects = getFolderRects();
		// this.linkRects = getLinksRects();
	}
})
.controller("desktopCtrl", function($scope, $timeout, gridService, keyboardManager){
	var links = [], folders = [], $allElements;
	var lastDragged;
	var timeout;
	var pushedX, pushedY;
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


		$(window).resize(function(){
			//lazy adjustment
			clearTimeout(timeout);
			timeout = setTimeout(onresize, 300);
		});

		keyboardManager.bind("ctrl+l", function(){
			$("#grid").toggle();
		});

		//wait for folder directive construction
		$timeout(function(){
			gridService.update();
			$scope.$apply();
		}, 100);
	}
	var onresize = function(){

		gridService.update();
		$scope.$apply();
	}

	$scope.links = links;
	$scope.folders = folders;
	$scope.grid = gridService;
	$scope.folderPreviewGrid = [2, 1];
	$scope.showFolderPreview = false;
	$scope.linkPreviewGrid = [3, 4];
	$scope.showLinkPreview = false;

	init();
	gridService.init(folders, links);

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
		var originRect, draggingRect, selectedGrid, $folder, $link;
		$(ele).draggable({
			start : function(e, ui){
				originRect = gridService.getRect($(this));
				selectedGrid = undefined;
				$folder = $(this);
			},
			drag : function(e, ui){

				draggingRect = gridService.getRect($folder);
				selectedGrid = gridService.findSelectedFolderGrid(originRect, draggingRect);
				if(!gridService.folderOccupied(selectedGrid)){
					$scope.showDragPreview(selectedGrid, "folder");
				}else{
					$scope.hideDragPreview("folder");
				}
			},
			stop : function(e, ui){

				var newHeight = ui.position.top + $(this).height();
				gridService.newViewHeight = newHeight + 20;
				if(newHeight > gridService.viewHeight){
					gridService.update();
				}

				$scope.hideDragPreview("folder");
				
				draggingRect = gridService.getRect($folder);
				selectedGrid = gridService.findSelectedFolderGrid(originRect, draggingRect);
				
				if(!gridService.folderOccupied(selectedGrid)){
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
		var originRect, draggingRect, selectedGrid, $folder, $link;
		var linkOccupied = function($link, selectedGrid){
			var rect1, rect2 = gridService.linkGridToRect(selectedGrid);
			for(var i = 0; i<gridService.links.length; i++){
				rect1 = gridService.linkGridToRect(gridService.links[i].grid);
				if(rect1.intersects(rect2))
					return true;
			}
			return false;
		}
		$(ele).draggable({
			start : function(e, ui){
				$link = $(ele);
				originRect = gridService.getRect($link);
				selectedGrid = undefined;
			},
			drag : function(e, ui){

				draggingRect = gridService.getRect($link);
				selectedGrid = gridService.findSelectedLinkGrid(originRect, draggingRect);
				if(!linkOccupied($link, selectedGrid)){
					$scope.showDragPreview(selectedGrid, "link");
				}else{
					$scope.hideDragPreview("link");
				}
				
			},
			stop : function(e, ui){

				var newHeight = ui.position.top + $(this).height();
				gridService.newViewHeight = newHeight + 20;
				if(newHeight > gridService.viewHeight){
					gridService.update();
				}

				$scope.hideDragPreview("link");
				
				draggingRect = gridService.getRect($link);
				selectedGrid = gridService.findSelectedLinkGrid(originRect, draggingRect);
				
				if(!linkOccupied($link, selectedGrid)){
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

