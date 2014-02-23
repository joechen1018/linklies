app.directive("lkFolder", function(gridService, gridSystem, gridRects, apiService){
	return {
		restrict : "EA",
		templateUrl : "templates/folder.html",
		controller : function($scope){
			$scope.grid = gridService;
			$scope.grids = gridSystem;
		},
		replace : true,
		scope: {
		    data : "="
		},
		link : function(scope, ele, attrs, ctrl){

			var gs = gridService;
			var grids = gridSystem;
			scope.getStyle = function(){
				if(scope.data && scope.data.grid){
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
		}
	}
})
.directive("lkLink", function(gridService, gridSystem, gridRects, apiService, $rootScope){
	return {
		restrict : "EA",
		templateUrl : "templates/link.html",
		controller : function($scope){

			$scope.grids = gridSystem;
			$scope.state = $scope.data.state || { name : "paste-url" };
			$scope.checkState = function(state){
				if(state === $scope.state.name)
					return true;
				return false;
			}
		},
		scope : {
			data : "="
		},
		replace : true,
		link : function(scope, ele, attrs){
			var grids = gridSystem;
			var data = scope.data;
			var linkService = apiService.linkService;
			scope.linkStyle = function(){
				if(scope.data.grid){
					return {
						left : grids.getLeft(scope.data.grid[0]),
						top : grids.getTop(scope.data.grid[1]),
						height : grids.linkSize.height,
						width : grids.linkSize.width
					}
				}
			}

			scope.onPasted = function(url){

				//scope.data.state = "ready";
				if(app.utils.isUrl(url)){
					scope.data.url = url;
					scope.state.name = "loading";
					linkService.create(url).then(function(data){

						//console.log(data);
						scope.data.meta = data.meta;
						scope.data.ico = data.ico;
						scope.data.title = data.title;
						//_c.log(glob.user);
						scope.data.username_id = glob.user.username_id;
						scope.data.user_id = glob.user.id;
						scope.state = {
							name : "ready"
						};
						//console.log(scope.data);
						scope.$apply();

						//_c.log(scope.data);
						linkService.save(scope.data);
					});
				}else{
					
				}
			}
			scope.removeLink = function(){
				$rootScope.$broadcast("removeLink", scope.data.id);
			}
			scope.showOpt = false;
			$(ele).on("mouseover", function(){
				scope.showOpt = true;
				scope.$apply();
			});
		}
	}
})
.directive("lkDrag", function(gridService, gridSystem, gridRects, apiService, $timeout){
	return {
		restrict : "EA",
		controller : function($scope){

		},
		scope : false,
		replace : true,
		link : function(scope, ele, attrs){
			//console.log(attrs);
			var ctrlScope = scope.$parent;
			$timeout(function(){

				//ctrlScope = scope;

				var rects = gridRects;
				var allRects = attrs.data === "link" ? gridRects.link : gridRects.folder;
				var data = attrs.data === "link" ? scope.link : scope.folder;
				var service = attrs.data === "link" ? apiService.linkService : apiService.folderService;
				var preview = attrs.data === "link" ? ctrlScope.dragPreview.link : ctrlScope.dragPreview.folder;
				var ref = attrs.data === "link" ? scope.link : scope.folder;
				//console.log(ref.grid);
				var gs = gridService;
				var originRect, originGrid, dragRect, selectedGrid, $ele;
				var sideWidth = gs.sideWidth;
				$(ele).draggable({
					containment : "#board",
					scroll: false,
					start : function(e, ui){
						$ele = $(ele);
						originRect = rects.getDomRect($ele);
						dragGrid = undefined;
						originGrid = data.grid;
					},
					drag : function(e, ui){

						scope.showOpt = false;
						dragRect = rects.getDomRect($ele);
						dragGrid = allRects.findDragRectGrid(
							originGrid,
							dragRect
						);
						isAvailable = allRects.gridAvailable(dragGrid);
						//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						if(isAvailable){
							preview.show = true;
							preview.grid = dragGrid;
						}else{
							preview.show = false;
						}
						ctrlScope.$apply();
					},
					stop : function(e, ui){

						preview.show = false;

						dragRect = rects.getDomRect($ele);
						dragGrid = allRects.findDragRectGrid(
							originGrid,
							dragRect
						);

						isAvailable = allRects.gridAvailable(dragGrid);
						//if there is a selected grid and the selected grid is not occupied
						//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						if(isAvailable){	
							// _c.log(ref);
							// _c.log(dragGrid);
							ref.grid = dragGrid;
							scope.$apply();
							service.save(ref);
						}else{
							$ele.animate({
								left : originRect.left,
								top : originRect.top
							}, 200);
							scope.$apply();
						}
					}
				});
			}, 1);
			return;
		}
	}
});