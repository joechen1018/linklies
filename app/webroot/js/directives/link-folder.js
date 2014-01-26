app.directive("lkFolder", function(gridService, gridSystem, gridRects){
	return {
		restrict : "EA",
		templateUrl : "templates/folder.html",
		controller : function($scope){
			$scope.grid = gridService;
			$scope.grids = gridSystem;
		},
		replace : true,
		scope: {
		    data : "=",
		    dragPreview : "=",
		    gridSystem : "=",
		    gridRects : "="
		},
		link : function(scope, ele, attrs, ctrl){

			var gs = gridService;
			var grids = gridSystem;
			scope.getStyle = function(){
				if(scope.data){
					return {
						left : scope.data.grid[0] * grids.gridFullWidth,
						top : scope.data.grid[1] * grids.gridFullHeight,
						width : grids.gridWidth,
						height : grids.folderSize.height
					}
				}
			}

			scope.getPos = function(){
				var arr = [$(ele).offset().left, $(ele).offset().top];
				return arr;
			}

			scope.grid = gs;
			var rects = gridRects;
			var folderRects = gridRects.folder;
			var $folder = $(ele);
			var timeout;
			var originRect, originGrid, dragRect, dragGrid, $folder, $link;
			var gs = gridService;
			var sideWidth = gs.sideWidth;
			var data = scope.data;
			var isAvailable = false;

			$(ele).draggable({
				containment : "#board",
				scroll: false,
				start : function(e, ui){
					$folder = $(ele);
					originRect = rects.getDomRect($folder);
					dragGrid = undefined;
					originGrid = data.grid;
				},
				drag : function(e, ui){

					dragRect = rects.getDomRect($folder);
					dragGrid = folderRects.findDragRectGrid(
						originGrid,
						dragRect
					);

					isAvailable = folderRects.gridAvailable(dragGrid);
					//console.log(isAvailable);
					//(!goog.array.equals(folderGrids[i], originGrid))
					if(isAvailable){
						scope.dragPreview.show = true;
						scope.dragPreview.grid = dragGrid;
					}else{
						scope.dragPreview.show = false;
					}
					
					scope.$apply(function(){
						scope.data.dragGrid = dragGrid;	
					});
				},
				stop : function(e, ui){

					scope.dragPreview.show = false;
					
					dragRect = rects.getDomRect($folder);
					dragGrid = folderRects.findDragRectGrid(
						originGrid,
						dragRect
					);

					isAvailable = folderRects.gridAvailable(dragGrid);
					//if there is a selected grid and the selected grid is not occupied
					//if(dragGrid !== undefined && !gs.occupied.folder(dragGrid)){
					if(isAvailable){
						scope.$apply(function(){
							scope.data.grid = dragGrid;
						});
					}else{
						$folder.animate({
							left : originRect.left,
							top : originRect.top
						}, 200);
					}
					//var near = gs.findNearistGrid.folder(selectedGrid);
				}
			});
			

		}
	}
})
.directive("lkLink", function(gridService, gridSystem, gridRects){
	return {
		restrict : "EA",
		templateUrl : "templates/link.html",
		controller : function($scope){
			$scope.grids = gridSystem;
		},
		scope : {
			data : "=",
			dragPreview : "="
		},
		replace : true,
		link : function(scope, ele, attrs){
			var grids = gridSystem;
			var data = scope.data;
			scope.linkStyle = function(){
				return {
					left : grids.getLeft(scope.data.grid[0]),
					top : grids.getTop(scope.data.grid[1]),
					height : grids.linkSize.height,
					width : grids.linkSize.width
				}
			}

			var rects = gridRects;
			var linkRects = gridRects.link;
			var gs = gridService;
			var originRect, originGrid, dragRect, selectedGrid, $folder, $link;
			var sideWidth = gs.sideWidth;
			$(ele).draggable({
				containment : "#board",
				scroll: false,
				start : function(e, ui){
					$link = $(ele);
					originRect = rects.getDomRect($link);
					//originRect = gs.getRect($link);
					dragGrid = undefined;
					originGrid = data.grid;
				},
				drag : function(e, ui){

					dragRect = rects.getDomRect($link);
					dragGrid = linkRects.findDragRectGrid(
						originGrid,
						dragRect
					);
					isAvailable = linkRects.gridAvailable(dragGrid);
					//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
					if(isAvailable){
						scope.dragPreview.show = true;
						scope.dragPreview.grid = dragGrid;
					}else{
						scope.dragPreview.show = false;
					}
					scope.$apply();
				},
				stop : function(e, ui){

					scope.dragPreview.show = false;

					dragRect = rects.getDomRect($link);
					dragGrid = linkRects.findDragRectGrid(
						originGrid,
						dragRect
					);

					isAvailable = linkRects.gridAvailable(dragGrid);
					//if there is a selected grid and the selected grid is not occupied
					//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
					if(isAvailable){	
						scope.data.grid = dragGrid;
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