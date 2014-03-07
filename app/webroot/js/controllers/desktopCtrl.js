'use strict';

goog.require('goog.math.Rect');
app.controller("desktopCtrl", function($scope, $rootScope, $timeout, $http, gridService, keyboardManager, resize, gridSystem, gridRects, apiService, uuid){

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
			$scope.$apply(function(){
				clearLinks();
			});
		});

		keyboardManager.bind("shift+d", function(){
			//_c.log(currentHoverLink);
		});

		if(glob.requireSign === true){
			// $scope.showOverlay = true;
			// $scope.requireSign = true;
		}

		$timeout(function(){
			$("body").css("overflow", "auto");
			$("#bg-loading").delay(10).hide();
			gridSystem.update();
		}, 10);
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
	glob.user = false;

	apiService.getUser(uid).then(function(rs){
		
		var data = rs.data;
		 _c.log(data);
		var user = data.User;
		var links = data.Link;
		var folders = data.Folder;
		var _try = function(data){
			var a;
			try{
		        a = $.parseJSON(data);
		    }catch(e){
		    	_c.warn("link type parse error");
		    	_c.warn(data);
		    	return {};
		    }
		    return a;
		}

		//** global variable to hold total number of links
		expectCount = links.length;

		$scope.user = user;
		$scope.user_id = user.id;
		$scope.username_id = user.username_id;

		for(var i = 0; i<links.length; i++){
			links[i].state = {name : "ready"};
			links[i].grid = links[i].grid.split(",");
			links[i].grid = [parseInt(links[i].grid[0], 10), parseInt(links[i].grid[1], 10)];

			if(links[i].meta == ""){
				links[i].meta = "{}";
			}
			links[i].meta = _try(links[i].meta);
			//links[i].type = _try(links[i].type);
			if(links[i].type == ""){
				links[i].type = "{}";
			}
			links[i].type = _try(links[i].type.trim());
			// _c.log(links[i].type);
			if(links[i].view == "search"){
				// _c.log(links[i].type);
			}
		}
		for(i = 0; i<folders.length; i++){
			folders[i].grid = folders[i].grid.split(",");
			folders[i].grid = [parseInt(folders[i].grid[0], 10), parseInt(folders[i].grid[1], 10)];
		}

		$scope.links = links;
		$scope.folders = folders;
		$scope.show = true;
		
		gridRects.links = links;
		gridRects.folders = folders;

		glob.user = user;

		$scope.$apply();
		init();
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
	$scope.show = false;
	var buffer = (function(){
		return new (function(){
			var limit = 800;
			this.amount = 0;
			this.limit = function(){
				// _c.log(Math.max([averageDelta, limit]));
				// return Math.max([averageDelta, limit]);
			}
			this.reset = function(){
				this.amount = 0;
			}
			this.add = function(amount){
				this.amount += amount;
				if(this.amount >= limit){
					this.onReachLimit();
				}
			}
			this.onReachLimit = function(){

			}
		});
	})();
	buffer.onReachLimit = function(){
		buffer.reset();
		$scope.$apply(function(){
			$scope.grids.buffer += 2;
			$scope.grids.update();
		});
	}
	var average = [];
	var averageDelta = 0;
	$(window).on("mousewheel", function(event) {
		//console.log(event.deltaX, event.deltaY, event.deltaFactor);
		//_c.log(event.deltaY);
		average.push(event.deltaY);
		averageDelta = (function(){
			var sum = 0;
			for(var i = 0; i<average.length; i++){
				sum += Math.abs(average[i]);
			}
			return sum / average.length;
		})();

		if(event.deltaY > 0){
			buffer.reset();
		}
		//if scrolled to bottom...
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			buffer.add(event.deltaFactor);
		}
	});

	//gs.init($scope.folders, $scope.links);

	/*$scope.$watch('grid.gridWidth', function(newVal, oldVal, scope){
		// console.log(newVal);
		// console.log(oldVal);
	});

	$scope.$watch("gridRects.folders", function(newVal, oldVal){
		//$scope.folders = newVal;
	});*/

	var getLatestLink = function(links){
		var max = 1, id, latestLink;
		for(var i = 0; i<links.length; i++){
			id = links[i].id;
			if($.type(id) === "string"){
				id = parseInt(id, 10);
			}
			if(id > max){
				max = id;
				latestLink = link;
			}
		}
		return latestLink;
	}

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
	}

	$scope.onBoardDbClick = function($event){
		var x = $event.pageX - gridSystem.defaults.sideWidth;
		var y = $event.pageY - gridSystem.defaults.topHeight;
		var g = gridRects.link.findNearGridByPoint(x, y);
		var newLink = {
			grid : g,
			uuid : uuid.create(),
			username_id : glob.user.username_id,
			user_id : glob.user.id,
			state : {
				name : "paste-url",
				focus : true
			}
		}
		clearLinks();
		$scope.links.push(newLink);
	}
	$scope.onBoardClick = function($event){
		clearLinks();
	}
	$scope.onLinkDbClick = function($event){
		var $link = $($event.currentTarget),
			$title = $link.find("a.title");

		//$title.selectText();
		$event.stopPropagation();
	}
	$scope.noIcon = false;
	$scope.onRightClick = function($event){
		var x = $event.pageX - gridSystem.defaults.sideWidth;
		var y = $event.pageY - gridSystem.defaults.topHeight;
		var g = gridRects.link.findNearGridByPoint(x, y);
		// _c.log($event.currentTarget);
		// _c.log("click on " + g);
	}

	$scope.onLinkClick = function($event){
		$event.stopPropagation();
		/*
		var $link = $($event.currentTarget),
			$title = $link.find("a.title");

		$title.selectText();	
		$event.stopPropagation();
		*/
	}
	$scope.showBrowser = false;
	$scope.closeBrowser = function(){
		$scope.showBrowser = false;	
		$("#browser iframe").attr("src", "");
		$("body").css("overflow", "");
	}

	var currentHoverLink;
	$rootScope.$on("linkCreationComplete", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid === link.uuid){
				if($.type(link.type) === "string"){
					link.type = JSON.parse(link.type);
				}
				$scope.$apply(function(){
					$scope.links[i] = link;	
				});
			}
		}
	});
	$rootScope.$on("linkCreationFailed", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid === link.uuid){
				$scope.$apply(function(){
					$scope.links.splice(i, 1);
				});
			}
		}
	});
	$rootScope.$on("linkHover", function(e, link){
		currentHoverLink = link;
	});
	$rootScope.$on("removeLink", function(e, id){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid == id || $scope.links[i].id == id){
				$scope.links.splice(i, 1);
				apiService.linkService.remove(id);
				//.then(function(res){});
				return;
			}
		}
	});
	$rootScope.$on("openPage", function(e, url){
		var $iframe = $("#browser iframe")
			,$body = $("body");

		$iframe.attr("src", url);
		$body.css("overflow", "hidden");

		$scope.showBrowser = true;
		$timeout(function(){
			$scope.$apply(function(){
				$scope.showWrap = true;
			});
		}, 500);

		$iframe.one("load", function(){
			$iframe.show();
			$scope.$apply(function(){
				
			});
		});
	});
});
