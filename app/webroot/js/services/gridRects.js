app.service("gridRects", function(gridSystem, apiService){

	var self = this;
	var grids = gridSystem;
	var gRect = goog.math.Rect;
	var arrayEquals = goog.array.equals;
	var Rect = function(x, y, w, h){
		return new gRect(x, y, w, h);
	}
	this.rectToGrid = function(rect){
		var grid;
		return grid;
	}
	this.getDomRect = function($dom){
		var pos = $dom.position();
		var rect = new goog.math.Rect(pos.left, pos.top, $dom.width(), $dom.height());
		return rect;
	}
	this.gridToRect = function(grid){
		var rect = new goog.math.Rect(
			grid[0] * gridSystem.gridFullWidth,
			grid[1] * gridSystem.gridFullHeight,
			gridSystem.gridWidth,
			gridSystem.folderSize.height
		);
		return rect;
	}
	this.folder = {
		getGrids : function(){
			var rows = grids.rows;
			var cols = grids.cols;
			var arr = [];
			for(var i = 0; i<rows.length*2; i++){
				for(var j = 0; j<cols.length; j++){
					if(i % 2 === 0){
						arr.push([cols[j], rows[i]]);
					}
				}
			}
			return arr;
		},
		gridToRect : function(grid){
			var rect = new goog.math.Rect(
				grid[0] * gridSystem.gridFullWidth,
				grid[1] * gridSystem.gridFullHeight,
				gridSystem.gridWidth,
				gridSystem.folderSize.height
			);
			return rect;
		},
		rectToGrid : function(rect){
			var grid;
			return grid;
		},
		gridAvailable : function(grid){
			if(!grid){
				return false;
			}
			var folders = self.folders;
			var links = self.links;
			for(var i = 0; i<folders.length; i++){
				if(arrayEquals(folders[i].grid, grid)){
					//console.log(folders[i].grid, grid);
					return false;
				}
			}
			return true;
			var rect1, rect2 = self.gridToRect.folder(grid);
			for(var i = 0; i<links.length; i++){
				rect1 = self.gridToRect.link(links[i].grid);
				if(rect1.intersects(rect2))
					return true;
			}
			return false;
		},
		findDragRectGrid : function(originGrid, dragRect){

			self.folderGrids = self.folder.getGrids();
			var folderGrids = self.folderGrids, 
				rect, 
				intersection, 
				area, 
				max = {
					area : 0, 
					grid : undefined
				};
			for(var i = 0; i<folderGrids.length; i++){
				if(! goog.array.equals(folderGrids[i], originGrid)){
					rect = self.folder.gridToRect(folderGrids[i]);
					// console.log("rect");
					// console.log(rect);
					// console.log("dragRect");
					// console.log(dragRect);
					//if(rect.intersects(draggingRect) && (!goog.math.Rect.equals(originRect, rect))){
					if(rect.intersects(dragRect) ){	

							intersection = gRect.intersection(rect, dragRect);
							intersection.area = intersection.width * intersection.height;
							if(intersection.area > max.area){
								max.area = intersection.area;
								max.grid = folderGrids[i];
							}
					}
				}
			}
			return max.grid;
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
		gridOccupied : function(grid){
			var bool = false;
			return bool;
		},
		findNearGrid : function(grid){
			var nearByGrid;
			return nearByGrid;
		},
		findNextGrid : function(){
			var nextGrid;
			return nextGrid;
		},
		findNearGridByPoint : function(x, y){

		}
	}
	this.link = {
		getGrids : function(){
			var rows = grids.rows;
			var cols = grids.cols;
			var arr = [];
			for(var i = 0; i<rows.length; i++){
				for(var j = 0; j<cols.length; j++){
					arr.push([cols[j], rows[i]]);
				}
			}
			return arr;
		},
		gridToRect : function(grid){
			var rect = new goog.math.Rect(
				grid[0] * gridSystem.gridFullWidth,
				grid[1] * gridSystem.gridFullHeight,
				gridSystem.linkSize.width,
				gridSystem.linkSize.height
			);
			return rect;
		},
		rectToGrid : function(rect){
			var grid;
			return grid;
		},
		gridAvailable : function(grid){
			if(!grid){
				return false;
			}
			var links = self.links;
			for(var i = 0; i<links.length; i++){
				if(arrayEquals(links[i].grid, grid)){
					//console.log(folders[i].grid, grid);
					return false;
				}
			}
			return true;
		},
		findDragRectGrid : function(originGrid, dragRect){
			var linkGrids = self.link.getGrids();
			var	rect, 
				intersection, 
				area, 
				max = {
					area : 0, 
					grid : undefined
				};

			for(var i = 0; i<linkGrids.length; i++){
				if(! goog.array.equals(linkGrids[i], originGrid)){
					rect = self.link.gridToRect(linkGrids[i]);
					if(rect.intersects(dragRect) ){	
							intersection = gRect.intersection(rect, dragRect);
							intersection.area = intersection.width * intersection.height;
							if(intersection.area > max.area){
								max.area = intersection.area;
								max.grid = linkGrids[i];
							}
					}
				}
			}
			return max.grid;
		},
		gridOccupied : function(grid){
			var bool = false;
			return bool;
		},
		findNearGrid : function(grid){
			var nearByGrid;
			return nearByGrid;
		},
		findNextGrid : function(){
			var nextGrid;
			return nextGrid;
		},
		findNearGridByPoint : function(x, y){
			var clickRect = new goog.math.Rect(x - 10, y - 10, 20, 20);
			var links = self.link.getGrids(), rect;
			var max = 0, inters, nearGrid;
			for(var i = 0; i<links.length; i++){
				rect = self.link.gridToRect(links[i]);
				inters = clickRect.intersects(rect);	
				//if(inters.width * inters.height > max){
				if(inters){
					max = inters.width * inters.height;
					nearGrid = links[i];
				}
			}
			return nearGrid;
		}
	}
	this.folderGrids = this.folder.getGrids();
	this.linkGrids = this.link.getGrids();
	
	this.folders = apiService.getFolders().then(function(folders){
		self.folders = folders;
	});
	this.links = apiService.getLinks().then(function(links){
		self.links = links;
	});
})
