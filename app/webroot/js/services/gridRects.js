app.service("gridRects", function(gridSystem){

	var self = this;
	var grids = gridSystem;
	var gRect = goog.math.Rect;
	var Rect = function(x, y, w, h){
		return new gRect(x, y, w, h);
	}
	this.gridToRect = function(grid){
		var rect;
		return rect;
	}
	this.rectToGrid = function(rect){
		var grid;
		return grid;
	}
	this.getDomRect = function($dom){
		var offset = $dom.position();
		return Rect(offset.left, offset.top, $dom.width, $dom.height);
	}
	this.folder = {
		getGrids : function(){
			var rows = grids.rows;
			var cols = grids.cols;
			var arr = [];
			for(var i = 0; i<rows.length; i++){
				for(var j = 0; j<cols.length; j++){
					if(i % 4 === 0){
						arr.push([rows[j], cols[i]]);
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
		findSelectedGrid : function(originGrid, dragRect){

			var folderGrids = self.folderGrids, 
				rect, 
				intersection, 
				area, 
				max = {
					area : 0, 
					grid : undefined
				};
			for(var i = 0; i<folderGrids.length; i++){
				rect = self.folder.gridToRect(folderGrids[i]);
				if(rect.intersects(dragRect)){
					console.log(folderGrids[i]);
				}
				if(folderGrids[i][0] == 4 && folderGrids[i][1] == 4){
					// console.log(rect);
					// console.log(dragRect);
				}
				//if(rect.intersects(draggingRect) && (!goog.math.Rect.equals(originRect, rect))){
				if(rect.intersects(dragRect) && 
					(!goog.array.equals(folderGrids[i], originGrid))){	

						intersection = gRect.intersection(rect, dragRect);
						intersection.area = intersection.width * intersection.height;
						console.log(intersection.area);
						if(intersection.area > max.area){
							max.area = area;
							max.grid = folderGrids[i];
						}
				}
			}
			//console.log(max.grid);
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
		findNearByGrid : function(grid){
			var nearByGrid;
			return nearByGrid;
		},
		findNextGrid : function(){
			var nextGrid;
			return nextGrid;
		}
	}
	this.link = {
		getGrids : function(){
			var rows = grids.rows;
			var cols = grids.cols;
			var arr;
			for(var i = 0; i<cols.length; i++){
				for(var j = 0; j<rows.length; j++){
					arr.push([cols[i], rows[j]]);
				}
			}
			return arr;
		},
		gridToRect : function(grid){
			var rect;
			return rect;
		},
		rectToGrid : function(rect){
			var grid;
			return grid;
		},
		findSelectedRect : function(originRect, dragRect){
			var selectedRect;
			return selectedRect;
		},
		gridOccupied : function(grid){
			var bool = false;
			return bool;
		},
		findNearByGrid : function(grid){
			var nearByGrid;
			return nearByGrid;
		},
		findNextGrid : function(){
			var nextGrid;
			return nextGrid;
		}
	}
	this.folderGrids = this.folder.getGrids();
})
