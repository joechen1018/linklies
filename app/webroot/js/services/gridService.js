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
	var scrollWidth = 0;
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
		return n + 5;
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
		return grids;
	}

	var newOccupation = [];
	var arrayEquals = goog.array.equals;
	var intersects = goog.math.Rect.intersects;
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

	this.update = function(folders, links){

		if(folders && links){
			self.folders = folders;
			self.links = links;
		}

		//new height comes from dragged element exceeding viewport
		self.contentHeight = self.getContentHeight();
		self.viewHeight = self.getSreenHeight();
		self.viewWidth = self.hasScrollbar() ? $(window).width() - scrollWidth : $(window).width();
		self.boardHeight = self.viewHeight - self.topHeight - bottomHeight;
		self.boardWidth = self.viewWidth - 2 * self.sideWidth;
		self.rows = getRowNum();
		self.cols = getColNum();
		self.gridWidth = self.getGridWidth();

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
		return $ele.offset().left + $ele.width() > $(window).width();
	}

	this.occupied = {
		folder : function(grid){
			var folders = self.folders;
			var links = self.links;
			for(var i = 0; i<folders.length; i++){
				if(arrayEquals(folders[i].grid, grid)){
					//console.log(folders[i].grid, grid);
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
				if(arrayEquals(links[i].grid, grid))
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

			//get only nearest folder grids
			min = (function(){
				var last = min[0].distance, arr = [], i = 0;
				while(min[i].distance && min[i].distance === last){
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
		folder : function(thisGrid, n){

			var folderGrids = self.folderGrids, 
			folderGrid, bool;

			for(var i = 0; i<folderGrids.length; i++){
				if(i !== n){
					folderGrid = folderGrids[i];
					bool = self.occupied.folder(folderGrid);

					if(!bool)
						return folderGrid;
				}
			}

			return false;
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

		this.update(folders, links);
	}
})
.service("resizeService", function(){
	
	var lastWidth = $(window).width();
	var currentWidth = lastWidth;
	var queue = [];
	var timeout;
	var delay = 300;
	var self = this, item;
	var checkQueue = function(){
		for(var i = queue.length - 1; i>-1; i--){
			if(currentWidth >= queue[i].width){
				item = queue[i];
				item.deferred.resolve(item.index, item.grid);
				queue.pop();

				/*delay ececution
				(function(item){
					setTimeout(function(){
						
					}, 10 * i);
				})(queue[i]);*/
			}
		}
	}
	this.whenWidthGreater = function(width, index, grid){
		var d = $.Deferred();
		queue.push({
			width : width,
			index : index,
			grid : grid,
			deferred : d
		});
		return d.promise();
	}	

	$(window).resize(function(){
		$(self).trigger("resize", [lastWidth]);
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			currentWidth = $(window).width();
			$(self).trigger("sizeChange", [lastWidth]);
			if(currentWidth > lastWidth){
				$(self).trigger("sizeUp", [lastWidth]);
			}else if(currentWidth < lastWidth){
				$(self).trigger("sizeDown", [lastWidth]);
			}

			checkQueue();
			lastWidth = currentWidth;
		}, delay);
	});
})