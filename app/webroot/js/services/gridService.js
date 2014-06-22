//** grid service is depreciated
app.service("gridService", function($rootScope, $timeout, resize){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	var folders, links;
	var scrollWidth = 0;
	var sideWidth = 90;
	var topHeight = 90;
	var defaultGridWidth = 150;
	var bottomHeight = 20;
	var gridHeight = 30;
	var gridMargin = 10;
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

	var arrayEquals = goog.array.equals;
	var intersects = goog.math.Rect.intersects;
	this.sideWidth = sideWidth;
	this.topHeight = topHeight;
	this.bottomHeight = bottomHeight;
	this.gridHeight = gridHeight;
	this.gridMargin = gridMargin;
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
		self.hlines = _.range(self.rows);
		self.vlines = _.range(self.cols);
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

	this.init = function(folders, links){

		this.folders = folders;
		this.links = links;
		this.update(folders, links);
	}
})
.service("gridSystem", function(resize){

	var self = this;
	var $board = $("#board");
	var getGridWidth = function(width){
		var num = Math.ceil((width - _d.margin) / (_d.gridWidth + _d.margin));
		var extra = width + _d.margin - (_d.gridWidth + _d.margin) * num;
		extra /= num;
		var w = _d.gridWidth + extra;
		return w;
	}

	var getGridHeight = function(height){
		var n = getRowNum(height, _d.gridHeight + _d.margin);
		var h = (height - (n-1) * _d.margin) / n;
		return h;
	}

	var getColNum = function(width, gridWidth){
		var n = Math.ceil((width - _d.margin) / gridWidth);
		return n - 1;
	}

	var getRowNum = function(height, gridFullHeight){
		var n = Math.ceil((height) / gridFullHeight);
		return n;
	}
	var defaults = {
		gridWidth : 150,
		gridHeight : 25,
		margin : 10,
		sideWidth : 90,
		topHeight : 90,
		bottomHeight : 40
	}
	var _d = defaults;
	this.defaults = defaults;
	this.gridHeight = _d.gridHeight;
	this.gridFullHeight = _d.gridHeight + _d.margin;
	this.show = false;
	this.buffer = 0;

	this.onResize = function(size){
		if(size && size.width)
			this.width = size.width - 2 * _d.sideWidth;
		if(size && size.height)
			this.height = size.height - _d.topHeight - _d.bottomHeight;

		this.update();
	}
	this.update = function(){
		this.windowWidth = $(window).width();
		this.windowHeight = $(window).height();
		this.width = $(window).width() - 2 * _d.sideWidth;
		this.height = resize.getHeight() - _d.topHeight - _d.bottomHeight;
		this.gridWidth = getGridWidth(this.width);
		this.gridFullWidth = this.gridWidth + _d.margin;
		this.gridHeight = _d.gridHeight;
		this.gridFullHeight = this.gridHeight + _d.margin;
		this.cols = _.range(getColNum(this.width, this.gridWidth));
		this.rows = _.range(getRowNum(this.height, _d.gridHeight + _d.margin) + 12 + this.buffer);
		this.folderSize = {
			width : this.gridWidth,
			fullWidth : this.gridWidth + _d.margin,
			height : 4 * this.gridHeight + 3 * _d.margin,
			fullHeight : 4 * (this.gridHeight + _d.margin)
		}
		this.linkSize = {
			width : 2 * this.gridWidth + _d.margin,
			fullWidth : 2 * this.gridFullWidth,
			height : this.gridHeight,
			fullHeight : _d.gridHeight + _d.margin
		}

		this.height = this.rows.length * this.gridFullHeight - _d.margin;
		// console.log("board height : " + this.height);
		// console.log("grid height : " + this.gridHeight);
		// console.log("folder height : " + this.folderSize.fullHeight);
	}

	this.getLeft = function(x){
		return x * this.gridFullWidth;
	}
	this.getTop = function(y){
		return y * this.gridFullHeight;
	}
	this.update();
})
.service("resize", function(){
	
	var lastWidth = $(window).width();
	var currentWidth = lastWidth;
	var queue = [];
	var timeout;
	var delay = 300;
	var self = this, item;
	var $elements = $(".folder, .link");
	var getBottom = function($item){
		return $item.offset().top + $item.height();
	}
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

	this.getHeight = function(){
		var height = $(window).height();
		var tmp;
		$elements = $(".folder, .link");
		$elements.each(function(i, e){
			tmp = getBottom($(e));
			if(tmp > height){
				height = tmp;
			}
		});
		return height;
	}
	this.currentWidth = $(window).width();
	this.currentHeight = this.getHeight();
	this.size = {
		width : this.currentWidth,
		height : this.currentHeight
	}
	$(window).resize(function(){
		$(self).trigger("resize", [lastWidth]);
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			self.size.width = $(window).width();
			self.size.height = self.getHeight();

			$(self).trigger("sizeChange", [lastWidth]);
			if(self.size.width > lastWidth){
				$(self).trigger("sizeUp", [lastWidth]);
			}else if(self.size.width < lastWidth){
				$(self).trigger("sizeDown", [lastWidth]);
			}

			checkQueue();
			lastWidth = self.size.width;
		}, delay);
	});
})