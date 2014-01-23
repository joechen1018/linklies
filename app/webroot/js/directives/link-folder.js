app.directive("lkFolder", function(gridService){
	return {
		restrict : "EA",
		templateUrl : "templates/folder.html",
		controller : function($scope){
			$scope.grid = gridService;
			$scope.previewGrid = [0,0];
			$scope.preview = true;
		},
		replace : true,
		scope: {
		    data : "=",
		    dkCtrl : "@"
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
			var originRect, originGrid, draggingRect, selectedGrid, $folder, $link;
			var gs = gridService;
			var sideWidth = gs.sideWidth;
			var data = scope.data;

			$(ele).draggable({
				containment : "#board",
				scroll: false,
				start : function(e, ui){
					originRect = gs.getRect($(ele));
					selectedGrid = undefined;
					originGrid = data.grid;
				},
				drag : function(e, ui){

					draggingRect = gs.getRect($folder);
					selectedGrid = gs.findSelectedGrid.folder(originGrid, draggingRect);
					if(selectedGrid !== undefined && !gs.occupied.folder(selectedGrid)){
						scope.preview = true;
						scope.previewGrid = selectedGrid;
					}else{
						scope.preview = false;
					}
					scope.$apply();
				},
				stop : function(e, ui){

					scope.preview = false;
					
					//get rect by current dom position
					draggingRect = gs.getRect($folder);

					//find selected grid, if current position is original grid, return undefined
					selectedGrid = gs.findSelectedGrid.folder(originGrid, draggingRect);
					
					//if there is a selected grid and the selected grid is not occupied
					if(selectedGrid !== undefined && !gs.occupied.folder(selectedGrid)){
						scope.data.grid = selectedGrid;
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

		},
		link : function(scope, ele, attrs){
			var gs = gridService;
			var originRect, originGrid, draggingRect, selectedGrid, $folder, $link;
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

					draggingRect = gs.getRect($link);
					selectedGrid = gs.findSelectedGrid.link(originRect, draggingRect);
					if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						scope.showDragPreview(selectedGrid, "link");
					}else{
						scope.hideDragPreview("link");
					}
				},
				stop : function(e, ui){

					//check if element exceeds bottom boundry and update
					gs.updateOverFlow(ui.position.top + $(ele).height());

					//hide the dragging preview div
					scope.hideDragPreview("link");
					
					//get rect by current dom position
					draggingRect = gs.getRect($link);
					//find selected grid, if current position is original grid, return undefined
					selectedGrid = gs.findSelectedGrid.link(originGrid, draggingRect);
					
					//if there is a selected grid and the selected grid is not occupied
					if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){

						//find the model by dom id
						for(var i = 0; i<scope.links.length; i ++){
							if(scope.links[i].id == $link.attr("id")){
								scope.links[i].grid = selectedGrid;
								scope.$apply();
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
	}
})

.directive("folderDropPreview", function(){
	return {
		restrict : "A",
		require : "lkFolder",
		link : function(scope, ele, attrs, folderCtrl){
			console.log(folderCtrl);
		}
	}
});