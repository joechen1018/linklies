'use strict';

goog.require('goog.math.Rect');
app.controller("desktopCtrl", function($scope, $rootScope, $timeout, $http, $sce,
									    keyboardManager, resize, gridSystem, gridRects, apiService, uuid, apiParser){
	var $allElements,
		$desk = $('#desktop-view'),
		timeout,
		rs = resize;

	//** 100ms after controller constructed
	var init = function(){

		var onSizeChange = function(){
		}
		var onSizeDown = function(evt, lastWidth){
		}
		var enablePlugins = function(){
			//**enable tooltip
			$(document).tooltip();
		}
		var lineDistance = function(point1, point2){
			var xs = 0;
			  var ys = 0;
			  xs = point2.x - point1.x;
			  xs = xs * xs;
			  ys = point2.y - point1.y;
			  ys = ys * ys;
			  return Math.sqrt( xs + ys );
		}
		$(rs).on("sizeChange", onSizeDown);

		//** show head thumb nearby mouse, remove this feature for now		
		/*$desk.on("mousemove", function(e){
			var x = e.clientX,
				y = e.clientY + $("body").scrollTop(),
				left = 0,
				top = 0,
				distance = 0,
				radius = 200,
				$links = $desk.find(".link");

				$links.each(function(i, e){
					left = $(e).offset().left + $(e).find(".state-ready").width() / 2;
					top = $(e).offset().top + $(e).find(".state-ready").height() / 2;
					distance = lineDistance({
						x : x,
						y : y
					},{
						x : left,
						y : top
					});
					if(distance <= radius){
						$(e).addClass("hover");
						$(e).find(".thumb-head").addClass("showThumbHead");
					}else{
						$(e).removeClass("hover");
						$(e).find(".thumb-head").removeClass("showThumbHead");
					}
				});
		});*/

		keyboardManager.bind("ctrl+l", function(){
			$scope.$apply(function(){
				//** toggle show grid
				$scope.grids.show = !$scope.grids.show;
			});
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
		}, 100);
	}
	var clearLinks = function(){
		for(var i = $scope.links.length - 1; i>-1; i--){
			if($scope.links[i].state && $scope.links[i].state.name == "paste-url"){
				$scope.links.splice(i, 1);
			}
		}
	}

	var onUserDataFetched = function(rs){
		var data = rs.data,
			user = data.User,
			links = data.Link,
			folders = data.Folder,
			phase,
			_try = function(data){
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

		//** parse links to objects	
		$(links).each(function(i, e){
			if(typeof links[i].grid === "string"){
				links[i] = apiParser.linkFromDb(e);
			}
		});	

		//** parse folders
		$(folders).each(function(i, e){
			e = apiParser.folderFromDb(e);
		});

		//** global variable used in app.js
		expectCount = links.length;

		//** scope variables
		$scope.user = user;
		$scope.user_id = user.id;
		$scope.username_id = user.username_id;
		$scope.links = links;
		$scope.folders = folders;
		$scope.show = true;
		
		//** init grid rects
		gridRects.links = links;
		gridRects.folders = folders;

		//** global user
		glob.user = user;

		//** if $scope is not digesting
		phase = $scope.$root.$$phase;
		if(phase !== '$apply' && phase !== '$digest') {
			$scope.$apply();
		}

		//** init desktop
		setTimeout(init, 100);
	}
	//user identifier
	var url = $.url();
	var uid = url.attr("path");
	var userData;

	uid = uid.split("/");
	uid = uid[uid.length - 1];
	glob.user = false;

	if(userData === undefined){
		apiService.getUser(uid).then(onUserDataFetched);
	}
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
	$scope.templates = {
		contextMenu : "templates/context-menu.html"
	};

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
		gridSystem.onResize(newSize);
	}, true);

	$scope.getDesktopStyle = function(){
		return {
			height : gridSystem.height + gridSystem.defaults.bottomHeight + gridSystem.defaults.topHeight,
			display : $scope.show ? "block" : "none"
		}
	}

	$scope.createLinkAt = function(url, grid){
		var newLink = {
			grid : grid,
			uuid : uuid.create(),
			username_id : glob.user.username_id,
			user_id : glob.user.id,
			url : url,
			state : {
				name : "paste-url",
				focus : true
			}
		}
		clearLinks();
		$scope.links.push(newLink);
	}

	$scope.createFolder = function(grid){
		var x, y, g;
		if(typeof grid === "object"){
			g = grid;
		}else{
			x = $event.pageX - gridSystem.defaults.sideWidth;
			y = $event.pageY - gridSystem.defaults.topHeight;
			g = gridRects.link.findNearGridByPoint(x, y);
		}
		if(g === false){
			var count = 0;
			while(g === false && count < 3){
				x += 5;
				y += 5;
				g = gridRects.link.findNearGridByPoint(x, y);
				count++;
			}
		}
		var newFolder = {
			user_id : glob.user.id,
			grid : g
		};

		apiService.folderService.create(glob.user.id, grid).then(function(folder){
			var hashids = new Hashids("kfiehndednppxqpcwwiex"),
		    	hash = hashids.encrypt(1, parseInt(folder.id, 10),3);

		    folder.hash = hash;
		    delete folder.grid;
			apiService.folderService.save(folder).then(function(folder){
				$scope.$apply(function(){
					folder.FolderType = {};
					folder.FolderType.icon = "Q";
					$scope.folders.push(folder);

					//* after rendered
					setTimeout(function(){
						var $folder = $("#folder-" +folder.id);
						var $input = $folder.find("#edit-name");
						var $name = $folder.find("p.name");

						$name.hide();
						$input.show()
							  .focus();

						$input.bind("focusout", function(){
							$input.unbind();
							$input.hide();
							$name.show();

							//** assign edited result to name
							for(var i = 0; i<$scope.folders.length; i++){
								if($scope.folders[i].id === folder.id){
									$scope.$apply(function(){
										$scope.folders[i].name = $input.val();

										//** save
										apiService.folderService.saveName(folder.id, $input.val()).then(function(res){
											// console.log(res);
										});
									});
								}
							}
						});

					}, 100);
				});
			});
		});
	}

	$scope.onBoardDbClick = function($event, grid){
		//**
		var x, y, g;
		if(typeof grid === "object"){
			g = grid;
		}else{
			x = $event.pageX - gridSystem.defaults.sideWidth;
			y = $event.pageY - gridSystem.defaults.topHeight;
			g = gridRects.link.findNearGridByPoint(x, y);
		}
		if(g === false){
			var count = 0;
			while(g === false && count < 3){
				x += 5;
				y += 5;
				g = gridRects.link.findNearGridByPoint(x, y);
				count++;
			}
		}
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
		$scope.context = {
			"show" : false,
			"class" : "",
			"left" : '-1000px',
			"top" : '-1000px'
		};
		clearLinks();
	}

	$scope.onLinkDbClick = function($event){
		var $link = $($event.currentTarget),
			$title = $link.find("a.title");

		//$title.selectText();
		$event.stopPropagation();
	}

	$scope.noIcon = false;
	$scope.context = {
		"show" : false,
		"class" : "",
		"left" : 0,
		"top" : 0
	};

	$scope.onRightClick = function($event){

		var x = $event.pageX - gridSystem.defaults.sideWidth,
			y = $event.pageY - gridSystem.defaults.topHeight,
			g = gridRects.link.findNearGridByPoint(x, y),
			$target = $($event.currentTarget),
			name = (function(){
				if($target.attr("id") === "board") return "board";
				if($target.hasClass("folder")) return "folder";
				if($target.hasClass("link")) return "link";
				return "board";
			})(),
			context = {};

		if(g === false){
			var count = 0;
			while(g === false && count < 3){
				x += 5;
				y += 5;
				g = gridRects.link.findNearGridByPoint(x, y);
				count++;
			}
		}

		var linkBool = gridRects.link.gridAvailable(g, [-1, -1]),
			folderBool = gridRects.folder.gridAvailable(g, [-1, -1]);

		//** if clicked point has space for link
		if(linkBool){
			//** context menu is relative to body, not #board. Left and top must be added
			context = {
				"show" : true,
				"class" : name,
				"left" : x + gridSystem.defaults.sideWidth,
				"top" : y + gridSystem.defaults.topHeight,
				"grid" : g
			};
			if(folderBool){
				context.folderAvailable = true;
			}
		}

		$scope.context = context;
		//$event.stopPropagation();
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

		applyFocus(browsingLink, getLinkIndex(browsingLink), false);
	}
	$scope.browserData = {
        url : "",
        show : false
    };

	var getLinkIndex = function(link){
		var _t = function(str){try{eval(str);}catch(e){return false;}}
		for(var i = 0; i<$scope.links.length; i++){
			if(_t('$scope.links[i].uuid == link.uuid') || _t('$scope.links[i].id == link.id')){
				return i;
			}
		}
		return -1;
	}
	var currentHoverLink;
	var applyFocus = function(targetLink, i, doApply){
		doApply = doApply == undefined ? true : false;
		targetLink.state.focusMe = true;

		if(doApply){
			$scope.$apply(function(){
				$scope.links[i] = targetLink;
			});	
		}else{
			$scope.links[i] = targetLink;	
		}
		
		setTimeout(function(){
			$scope.$apply(function(){
				if($scope.links[i]){
					$scope.links[i].state.focusMe = false;
				}
			});
		}, 30 * 1000);
	}

	$rootScope.$on("browserDataChange", function(e, data){
		if(data.url){
			data.url = $sce.trustAsResourceUrl(data.url)
		}
		$scope.browserData = data;
	});

	//** delete folder
	$rootScope.$on("deleteFolder", function(e, folder_id){
		for(var i = 0; i<$scope.folders.length; i++){
			if($scope.folders[i].id === folder_id){
				$scope.folders.splice(i, 1);
				apiService.folderService.remove(folder_id).then(function(res){
					console.log(res);
				});
			}
		}
	});


	//** on link updated
	$rootScope.$on("linkUpdated", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].id === link.id){
				$scope.links[i] = link;
			}
		}
	});

	//** on link creation completed
	//** triggered in link-folder.js
	$rootScope.$on("linkCreationComplete", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid == link.uuid){
				applyFocus(link, i, false);
			}
		}
	});

	$rootScope.$on("folderUpdated", function(e, folder){
		for(var i = 0; i<$scope.folders.length; i++){
			if($scope.folders[i].id == folder.id){
				$scope.folders[i] = folder;
			}
		}
	});

	//** on link creation completed
	//** triggered in popupCtrl.js
	$rootScope.$on("popupClosed", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid == link.uuid){
				applyFocus(link, i, false);
			}
		}
	});

	//** on finding valid images task completed
	//** triggered in link-folder.js
	$rootScope.$on("findValidThumbsTaskComplete", function(e, link){
		for(var i = 0; i<$scope.links.length; i++){
			if($scope.links[i].uuid == link.uuid){
				$scope.links[i].images = link.images;
				// console.log($scope.links[i]);
			}
		}
	});

	//** on link creation fails
	//** triggered in link-folder.js
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

	$rootScope.$on("showFolderMenu", function(e, context){
		$scope.context = context;
	});

	var browsingLink;
	$rootScope.$on("openPage", function(e, link){
		var $iframe = $("#browser iframe"),
		$body = $("body");

		browsingLink = link;

		$iframe.attr("src", link.url);
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

	$rootScope.$on("stopVideo", function(e, link){
		applyFocus(link, getLinkIndex(link), false);
	});
});
