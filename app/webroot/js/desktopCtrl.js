
goog.require('goog.math.Rect');
app.service("grid", function($timeout){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	
	this.getGridWidth = function(){
		var viewportWidth = $(window).width() - 30 - getScrollbarWidth();
		var num = Math.floor(viewportWidth/160);
		var extra = viewportWidth - num*160;
		return Math.round(150 + (extra/num));
	}

	this.findFolderRect = function(pos){

	}
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
	this.init = function(){

		self.gridHeight = 30;
		self.gridMargin = 10;

		this.update();

		// this.folderRects = getFolderRects();
		// this.linkRects = getLinksRects();
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
	this.updateViewHeight = function(){

	}
	this.init();
	
})
.controller("desktopCtrl", function($scope, $timeout, grid, keyboardManager){
	var links = [], folders = [], $allElements;;
	var lastDragged;
	var timeout;

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
			var timeout;
			var originRect, draggingRect, selectedGrid, $folder, $link;
			var linkOccupied = function($link, grid){
				// console.log(grid);
				var rect1, rect2 = linkGridToRect(grid);
				// var occupied = false;
				// $(".link").each(function(i, e){
				// 	rect1 = new goog.math.Rect($(e).offset().left, $(e).offset().top, $(e).width(), $(e).height());
				// 	if($link !== $(e)){
				// 		if(rect1.intersects(rect2)){
				// 			console.log(2);
				// 			occupied = true;
				// 		}
				// 	}
				// });
				// return occupied;
				for(var i = 0; i<links.length; i++){
					rect1 = linkGridToRect(links[i].grid);
					if(rect1.intersects(rect2))
						return true;
				}
				return false;
			}
			$(".folder").draggable({
				start : function(e, ui){
					originRect = getRect($(this));
					selectedGrid = undefined;
					$folder = $(this);
				},
				drag : function(e, ui){

					draggingRect = getRect($folder);
					selectedGrid = findSelectedFolderGrid(originRect, draggingRect);
					if(!folderOccupied(selectedGrid)){
						$scope.folderPreviewGrid = selectedGrid;
						$scope.showFolderPreview = true;
					}else{
						$scope.showFolderPreview = false;
					}
					$scope.$apply();
				},
				stop : function(e, ui){

					var newHeight = ui.position.top + $(this).height();
					grid.newViewHeight = newHeight + 20;
					if(newHeight > grid.viewHeight){
						grid.update();
					}

					$scope.showFolderPreview = false;
					
					draggingRect = getRect($folder);
					selectedGrid = findSelectedFolderGrid(originRect, draggingRect);
					
					if(!folderOccupied(selectedGrid)){
						for(var i = 0; i<folders.length; i ++){
							if(folders[i].id == $folder.attr("id")){
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

			$(".link").draggable({
				start : function(e, ui){
					$link = $(this);
					originRect = getRect($link);
					selectedGrid = undefined;
				},
				drag : function(e, ui){

					draggingRect = getRect($link);
					selectedGrid = findSelectedLinkGrid(originRect, draggingRect);
					if(!linkOccupied($link, selectedGrid)){
						$scope.linkPreviewGrid = selectedGrid;
						$scope.showLinkPreview = true;
					}else{
						$scope.showLinkPreview = false;
					}
					$scope.$apply();
				},
				stop : function(e, ui){

					//return;
					var newHeight = ui.position.top + $(this).height();
					grid.newViewHeight = newHeight + 20;
					if(newHeight > grid.viewHeight){
						grid.update();
					}

					$scope.showLinkPreview = false;
					
					draggingRect = getRect($link);
					selectedGrid = findSelectedLinkGrid(originRect, draggingRect);
					
					if(!linkOccupied($link, selectedGrid)){
						for(var i = 0; i<links.length; i ++){
							if(links[i].id == $link.attr("id")){
								$scope.links[i].grid = selectedGrid;
							}
						}
					}else{
						$link.animate({
							left : originRect.left,
							top : originRect.top
						}, 200);
					}
					$scope.$apply();
				}
			});

			grid.update();
			$scope.$apply();

		}, 100);
	}

	init();

	$scope.links = links;
	$scope.folders = folders;
	$scope.grid = grid;
	$scope.folderPreviewGrid = [2, 1];
	$scope.showFolderPreview = false;
	$scope.linkPreviewGrid = [3, 4];
	$scope.showLinkPreview = false;

	$scope.getLinkStyle = function(link){
		
		return {
			left : 20 + link.grid[0] * (grid.gridWidth + grid.gridMargin),
			top : link.grid[1] * (grid.gridHeight + grid.gridMargin) + 20,
			height : grid.gridHeight,
			width : grid.linkWidth
		}
	}
	$scope.getFolderStyle = function(folder){
		return {
			left : 20 + folder.grid[0] * (grid.gridWidth + grid.gridMargin),
			top : 20 + folder.grid[1] * (grid.gridHeight+ grid.gridMargin) * 4 ,
			width : grid.gridWidth,
			height : grid.folderHeight
		}
	}
	var onresize = function(){

		grid.update();
		$scope.$apply();

		//reposition();
	}

	var pushForward = function($ele){
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

	var overlayByPrev = function($prev, $current){
		return false;
	}
	var pushedX, pushedY;
	var reposition = function(){
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

	var isFolder = function($ele){
		return $ele.attr("id").indexOf("folder") !== -1;
	}

	var outOfBoundry = function($ele){
		return $ele.offset().left + $ele.width() > $(window).width();
	}
	
	var linkGridInFolderGrid = function(linkGrid, folderGrid){
		var linkRect = new goog.math.Rect();
	}
	var folderOccupied = function(grid){
		folders = $scope.folders;
		links = $scope.links;
		for(var i = 0; i<folders.length; i++){
			if(goog.array.equals(folders[i].grid,grid)){
				return true;
			}
		}
		var rect1, rect2 = folderGridToRect(grid);;
		for(var i = 0; i<links.length; i++){
			rect1 = linkGridToRect(links[i].grid);
			if(rect1.intersects(rect2))
				return true;
		}
		return false;
	}
	
	var isOriginalGrid = function($folder, grid){
		for(var i = 0; i<folders.length; i++){
			if(folders[i].id === $folder.attr("id")){
				if(goog.array.equals(folders[i].grid,grid)){
					return true;
				}
			}
		}
		return false;
	}
	var findSelectedFolderGrid = function(originRect, draggingRect){
		//find in all available rects, which has most intersection
		var folderRects = grid.folderRects, rect, intersection, area, max = {area : 0, grid : undefined};
		var linkRects = grid.linkRects;
		var occupied; 
		
		for(var i = 0; i<folderRects.length; i++){
			rect = folderRects[i];
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
	var findSelectedLinkGrid = function(originRect, draggingRect){
		//find in all available rects, which has most intersection
		var rect, intersection, area, max = {area : 0, grid : undefined};
		var linkRects = grid.linkRects;
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
	var getRect = function($target){
		var offset = $target.offset();
		return new goog.math.Rect(offset.left, offset.top, $target.width(), $target.height());
	}
	var folderGridToRect = function(folderGrid){
		var rect = new goog.math.Rect(
			20 + folderGrid[0] * (grid.gridWidth + grid.gridMargin),
			20 + folderGrid[1] * (grid.gridHeight + grid.gridMargin) * 4 ,
			grid.gridWidth,
			grid.folderHeight
		);
		return rect;
	}
	var linkGridToRect = function(linkGrid){
		var rect = new goog.math.Rect(
			20 + linkGrid[0] * (grid.gridWidth + grid.gridMargin),
			linkGrid[1] * (grid.gridHeight + grid.gridMargin) + 20,
			grid.linkWidth,
			grid.gridHeight
		);
		return rect;
	}
})
.directive("folderDirective", function(grid){
	return function(scope, ele, attrs){
	}
})
.directive("linkDirective", function(grid){
	return function(scope, ele, attrs){
	}
});

