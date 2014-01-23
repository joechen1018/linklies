app.directive("lkFolder", function(gridService){
	return {
		restrict : "EA",
		templateUrl : "templates/folder.html",
		controller : function($scope){
			$scope.grid = gridService;
		},
		replace : true,
		scope: {
		    data : "=",
		    dragPreview : "="
		},
		link : function(scope, ele, attrs, ctrl){

			scope.getStyle = function(){
				return {
					left : scope.data.grid[0] * (gridService.gridWidth + gridService.gridMargin),
					top : scope.data.grid[1] * (gridService.gridHeight+ gridService.gridMargin) * 4,
					width : gridService.gridWidth,
					height : gridService.folderHeight
				}
			}

			scope.getPos = function(){
				var arr = [$(ele).offset().left, $(ele).offset().top];
				return arr;
			}

			scope.grid = gs;

			var $folder = $(ele);
			var timeout;
			var originRect, originGrid, dragRect, dragGrid, $folder, $link;
			var gs = gridService;
			var sideWidth = gs.sideWidth;
			var data = scope.data;

			$(ele).draggable({
				containment : "#board",
				scroll: false,
				start : function(e, ui){
					originRect = gs.getRect($(ele));
					dragGrid = undefined;
					originGrid = data.grid;
				},
				drag : function(e, ui){

					dragRect = gs.getRect($folder);
					dragGrid = gs.findSelectedGrid.folder(originGrid, dragRect);
					if(dragGrid !== undefined && !gs.occupied.folder(dragGrid)){
						scope.dragPreview.show = true;
						scope.dragPreview.grid = dragGrid;
					}else{
						scope.dragPreview.show = false;
					}
					scope.$apply();
				},
				stop : function(e, ui){

					scope.dragPreview.show = false;
					
					//get rect by current dom position
					dragRect = gs.getRect($folder);

					//find selected grid, if current position is original grid, return undefined
					dragGrid = gs.findSelectedGrid.folder(originGrid, dragRect);
					
					//if there is a selected grid and the selected grid is not occupied
					if(dragGrid !== undefined && !gs.occupied.folder(dragGrid)){
						scope.data.grid = dragGrid;
					}else{
						$folder.animate({
							left : originRect.left,
							top : originRect.top
						}, 200);
					}
					
					scope.$apply();

					//var near = gs.findNearistGrid.folder(selectedGrid);
				}
			});
		}
	}
})
.directive("lkLink", function(gridService){
	return {
		restrict : "EA",
		templateUrl : "templates/link.html",
		controller : function($scope){
			$scope.linkWidth = function(){
				gridService.update();
				return gridService.linkWidth;
			}
		},
		scope : {
			data : "=",
			dragPreview : "="
		},
		replace : true,
		link : function(scope, ele, attrs){

			var data = scope.data;
			scope.linkStyle = function(){
				return {
					left : data.grid[0] * (gridService.gridWidth + gridService.gridMargin),
					top : data.grid[1] * (gridService.gridHeight + gridService.gridMargin),
					height : gridService.gridHeight,
					width : gridService.linkWidth
				}
			}


			var gs = gridService;
			var originRect, originGrid, dragRect, selectedGrid, $folder, $link;
			var sideWidth = gs.sideWidth;
			$(ele).draggable({
				containment : "#board",
				scroll: false,
				start : function(e, ui){
					$link = $(ele);
					originRect = gs.getRect($link);
					selectedGrid = undefined;
					originGrid = JSON.parse($link.attr("data-grid"));
				},
				drag : function(e, ui){

					dragRect = gs.getRect($link);
					selectedGrid = gs.findSelectedGrid.link(originRect, dragRect);
					if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						scope.dragPreview.show = true;
						scope.dragPreview.grid = selectedGrid;
					}else{
						scope.dragPreview.show = false;
					}
					scope.$apply();
				},
				stop : function(e, ui){

					scope.dragPreview.show = false;

					//check if element exceeds bottom boundry and update
					gs.updateOverFlow(ui.position.top + $(ele).height());

					//get rect by current dom position
					dragRect = gs.getRect($link);
					//find selected grid, if current position is original grid, return undefined
					selectedGrid = gs.findSelectedGrid.link(originGrid, dragRect);
					//if there is a selected grid and the selected grid is not occupied
					if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						scope.data.grid = selectedGrid;
					}else{
						$link.animate({
							left : originRect.left,
							top : originRect.top
						}, 200);
					}

					scope.$apply();
				}
			});

		}
	}
});