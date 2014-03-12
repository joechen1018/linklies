app.service("gridRects", function(gridSystem){

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
			var rect1, rect2 = self.folder.gridToRect(grid);
			for(var i = 0; i<links.length; i++){
				rect1 = self.link.gridToRect(links[i].grid);
				if(rect1.intersects(rect2))
					return false;
			}
			return true;
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
		gridAvailable : function(grid, originGrid){
			if(!grid){
				return false;
			}
			var links = self.links,
				folders = self.folders,
				rect1, 
				rect2 = self.link.gridToRect(grid);

			//** check folder intersection
			for(var i = 0; i<folders.length; i++){
				rect1 = self.folder.gridToRect(folders[i].grid);
				if(rect1.intersects(rect2))
					return false;
			}	

			//** check grid existence by comparing two arrays
			for(i = 0; i<links.length; i++){
				if(arrayEquals(links[i].grid, grid))
					return false;
			}

			//** exclude from self grid, will this link overlape other links?
			for(i = 0; i<links.length; i++){
				//** exclude self, so you can move the link 1 grid left or right
				if(!arrayEquals(links[i].grid, originGrid)){
					if(self.link.gridToRect(links[i].grid).intersects(rect2)){
						return false;
					}
				}
			}

			return true;
		},
		findDragOverFolder : function(dragRect){
			var folders = self.folders;
			var rect1, rect2 = dragRect;
			var max = 0, intersection, area, $folder = false;
			for(var i = 0; i<folders.length; i++){
				rect1 = self.folder.gridToRect(folders[i].grid);
				if(rect1.intersects(dragRect)){
					intersection = gRect.intersection(rect1, dragRect);
					area = intersection.width * intersection.height;
					if(area > max){
						max = area;
						$folder = $("#folder-" + folders[i].id);
					}
				}
			}
			return $folder;
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

			//** 20x20 rect with clicked point in the center
			var clickRect = new goog.math.Rect(x - 1, y - 1, 2, 2),
				grids = self.link.getGrids(), 
				rect,
				max = 0, 
				inters, 
				nearGrid;

			//** find grid with most intersection
			for(var i = 0; i<grids.length; i++){
				rect = self.link.gridToRect(grids[i]);
				if(rect.contains(clickRect)){
					return grids[i];
				}
				/*
				inters = gRect.intersection(rect, clickRect);
				if(inters){
					if(max < inters.width * inters.height){
						max = inters.width * inters.height;
						nearGrid = grids[i];
					}
				}*/
			}
			return false;
		}
	}
	this.folderGrids = this.folder.getGrids();
	this.linkGrids = this.link.getGrids();
})
