'use strict';

goog.require('goog.math.Rect');
app.controller("desktopCtrl", function($scope, $rootScope, $timeout, $http, gridService, keyboardManager, resize, gridSystem, gridRects, apiService){

	var $allElements;
	var timeout;
	var rs = resize;
	var gs = gridService;
	var sideWidth = gs.sideWidth;
	var init = function(){

		var onSizeChange = function(){
			gs.update();
		}
		var onSizeDown = function(evt, lastWidth){
			/*var folders = $scope.folders, folder, grid, rect, dist, newGrid;
			var cols = gs.cols;

			//gs.update($scope.folders, $scope.links);

			//lastWidth = $(window).width();
			for(var i = folders.length - 1; i>-1; i--){

				folder = folders[i];
				grid = folder.grid;
				rect = gs.gridToRect.folder(grid);
				dist = 1 * gs.sideWidth + rect.left + rect.width;
				//lastWidth = $(window).width();
				if($(window).width() <= dist + 2 * gs.sideWidth){

					rs.whenWidthGreater(dist, i, grid).then(function(index, grid){
						$scope.$apply(function(){
							$scope.folders[index].grid = grid;
						});
					});

					newGrid = gs.findNextGrid.folder(grid, i);
					//console.log(newGrid, i);
					$scope.folders[i].grid = newGrid;
				}
			}*/
			$scope.$apply();
			//gs.update();
		}

		$(rs).on("sizeChange", onSizeDown);
		//$(rs).on("sizeDown", onSizeDown);

		keyboardManager.bind("ctrl+l", function(){
			$scope.grids.show = !$scope.grids.show;
			$scope.$apply();
		});

		keyboardManager.bind("esc", function(){
			clearLinks();
			$scope.$apply();
		});

		if(glob.requireSign === true){
			// $scope.showOverlay = true;
			// $scope.requireSign = true;
		}
	}
	var clearLinks = function(){
		for(var i = $scope.links.length - 1; i>-1; i--){
			if($scope.links[i].state && $scope.links[i].state.name == "paste-url"){
				$scope.links.splice(i, 1);
			}
		}
	}

	//user identifier
	var url = $.url();
	var uid = url.attr("path");
	uid = uid.split("/");
	uid = uid[uid.length - 1];
	$scope.user = (function(){
		var d = $.Deferred();
		$.ajax({
			url : "users/findById/" + uid,
			success : function(rs){
				d.resolve(rs);

				/*init when got user*/

				init();
			}
		});
		return d.promise();
	})().then(function(user){
		user = user.user.User;
		//_c.log(user);
		$scope.user_id = user.id;
		$scope.username_id = user.username_id;
		glob.user = user;
		$scope.$apply();
	});

	apiService.getLinks().then(function(links){
		//_c.log(links);
		$scope.links = links;
		$scope.$apply();

		$timeout(function(){
			gridSystem.update();
		}, 100);
	});
	$scope.folders = gridRects.folders.then(function(folders){
		$scope.folders = gridRects.folders;
	});
	$scope.grid = gridService;
	$scope.resize = resize;
	$scope.grids = gridSystem;
	$scope.showGrid = false;
	$scope.dragPreview = {
		folder : {
			grid : [0, 0],
			show : false
		},
		link : {
			grid : [0,0],
			show : false
		}
	};
	$scope.show = true;
	//gs.init($scope.folders, $scope.links);

	$scope.$watch('grid.gridWidth', function(newVal, oldVal, scope){
		// console.log(newVal);
		// console.log(oldVal);
	});

	$scope.$watch("gridRects.folders", function(newVal, oldVal){
		//$scope.folders = newVal;
	});

	$scope.$watch('resize.size', function(newSize, oldSize){
		// console.log(newVal);
		// console.log(oldVal);
		gridSystem.onResize(newSize);
	}, true);

	$scope.getDesktopStyle = function(){
		return {
			height : gridSystem.height + gridSystem.defaults.bottomHeight + gridSystem.defaults.topHeight,
			display : $scope.show ? "block" : "none"
		}
		var hasScrollbar = gridService.hasScrollbar();
		if(hasScrollbar){
			return {
				height : gridSystem.height + gridSystem.defaults.bottomHeight + gridSystem.defaults.topHeight + 40,
				display : $scope.show ? "block" : "none"
			}
		}else{
			return {
				height : gridSystem.height + gridSystem.defaults.bottomHeight + gridSystem.defaults.topHeight + 40,
				display : $scope.show ? "block" : "none"
			}
		}
	}

	$scope.onBoardClick = function($event){
		var x = $event.pageX - gridSystem.defaults.sideWidth;
		var y = $event.pageY - gridSystem.defaults.topHeight;
		var grid = gridRects.link.findNearGridByPoint(x, y);
		var newLink = {
			grid : grid,
			state : {
				name : "paste-url",
				focus : true
			}
		}
		clearLinks();
		$scope.links.push(newLink);
	}

	$scope.onLinkClick = function($event){
		$event.stopPropagation();
		//$event.preventDefault();
	}

	$rootScope.$on("removeLink", function(e, id){
		//console.log(id);
		apiService.linkService.remove(id).then(function(){
			for(var i = 0; i<$scope.links.length; i++){
				if($scope.links[i].id == id){
					//console.log(id);
					$scope.links.splice(i, 1);
					$scope.$apply();
					return;
				}
			}
		});
	});
});
