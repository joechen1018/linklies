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
					if(scope.data.grid.length !== 2){
						scope.data.grid = scope.data.grid.split(",");
					}
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
.directive("lkLink", function(gridService, gridSystem, gridRects, apiService, $rootScope, contentParser, $timeout, uuid){
	return {
		restrict : "EA",
		templateUrl : "templates/link.html",
		controller : function($scope){

			$scope.grids = gridSystem;
			$scope.state = $scope.data.state || { name : "paste-url" };
			$scope.checkState = function(state){
				if(state === $scope.state.name) return true;
				return false;
			}
		},
		scope : {
			data : "="
		},
		replace : true,
		link : function(scope, ele, attrs){
			// _c.log(scope.data);
			var grids = gridSystem;
			var data = scope.data;
			var linkService = apiService.linkService;
			var $playerHolder, $detailWrap, $player;
			var ctrlScope = scope.$parent;

			$timeout(function(){
				$playerHolder = $(ele).find(".player-holder").eq(0);
				$detailWrap = $(ele).find(".link-details").eq(0);
				$player = $playerHolder.find("iframe").eq(0);
			}, 500);


			scope.showOpt = false;
			scope.linkStyle = function(){
				if(scope.data.grid){
					if(scope.data.grid.length !== 2){
						scope.data.grid = scope.data.grid.split(",");
					}
					return {
						left : grids.getLeft(scope.data.grid[0]),
						top : grids.getTop(scope.data.grid[1]),
						height : grids.linkSize.height,
						width : grids.linkSize.width,
						zIndex : scope.showOpt ? 100 : 1
					}
				}
			}

			scope.onPasted = function(url){
				//scope.data.state = "ready";
				if(app.utils.isUrl(url)){
					scope.data.url = url;
					scope.state.name = "loading";
					var colorShift;
					var initColorShifting = function(){
						var blue = "#4b9884", green = "#aacc8e", yellow = "#faec0a", orange = "#fe9d04";
						var duration = 200, colors = [blue, orange, green, yellow];
						var i = 0;
						colorShift = setInterval(function(){
							$(".state-loading .no-icon").animate({
								backgroundColor : colors[i%colors.length]
							}, duration);
							i++;
						}, duration);
					}
					initColorShifting();
					linkService.create(url).then(function(data){
						/*
						console.log(data);
						console.log(scope.data);
						*/
						//** use new data but keep a copy of the old
						var oldData = scope.data;
						scope.data = data;

						//** attribute that we will use from old
						var list = ["dragging", "grid", "thumb", "url", "user_id", "username_id", "uuid"];
						for(var i in oldData){
							for(var j = 0; j<list.length; j++){
								if(i == list[j]){
									scope.data[i] = oldData[list[j]];
								}
							}
						}
						var _try=function(e){var t;try{t=JSON.parse(e)}catch(n){return{}}return t}
						scope.data.meta = data.meta1;
						scope.data.title = data.title || scope.data.meta1["og:title"];
						scope.data.title = $("<div/>").html(scope.data.title).text();
						scope.data.thumb = data.thumb;
						if(data.thumb === "" || data.thumb === undefined){
							if(scope.data.meta){
								scope.data.thumb = scope.data.meta["og:image"];
							}
						}
						// _c.log(scope.data.grid);
						if($.type(scope.data.grid) !== "array"){
							scope.data.grid = scope.data.grid.split(",");
						}
						scope.data.grid[0] = parseInt(scope.data.grid[0], 10);
						scope.data.grid[1] = parseInt(scope.data.grid[1], 10);

						if($.type(scope.data.type) === "string"){
						//if(true){	
						//if(false){		
							try{
								scope.data.type = $.parseJSON(scope.data.type);
							}catch(e){}
						}
						scope.state = {
							name : "ready"
						}
						scope.data.state = {
							name : "ready"
						};

						//_c.log($.type(scope.data.type));
						clearInterval(colorShift);
						scope.$apply();
						ctrlScope.$apply(function(){
							ctrlScope.links.push(scope.data);
						});

						linkService.save(scope.data).then(function(rs){
							//console.log("saved");
							//console.log(rs);
							scope.data.id = rs.data.Link.id;
							scope.$apply();
						});
					}).fail(function(){
						alert("failed");
					});
				}else{
					
				}
			}
			scope.removeLink = function(){
				$rootScope.$broadcast("removeLink", scope.data.uuid);
				//$(_events).trigger("removeLink", [scope.data.id || scope.data.uuid])
			}
			scope.openPage = function(){
				//console.log(scope.data);
				$rootScope.$broadcast("openPage", scope.data.url);
			}
			scope.iconHover = false;
			scope.isPlayingVideo = false;
			scope.playVideo = function(){

				//** prevent detail hidden when mouse out
				$(ele).unbind();


				/*	
				using embeded player instead of chromeless player
					var pid = "player-" + uuid.create();
					$playerHolder.append("<div id='" + pid + "'></div>");
				*/
				var type = scope.data.type;
				if($.type(type) === "string"){
					type = $.parseJSON(type);
					scope.data.type = type;
				}
				/*
				_c.log(scope.data);
				_c.log(type);
				_c.log($.type(type));
				_c.log(type.name);
				_c.log(type.embedUrl);
				_c.log(scope.data.videoId);
				*/
				if(type.name === "youtube.watch"){
					
				}else if(type.name === "vimeo.watch"){

				}
				
				//hide displayed image
				var img = $detailWrap.find(".img");
				img.hide();

				//give iframe a src and show it
				var src = utils.replace(type.embedUrl, {
					"VIDEO_ID" : scope.data.videoId
				});

				$player.attr("src", src);
				$player.show();
				//_c.log($player);

				//set player size to match the image size
				$playerHolder.css('top', img.position().top)
						   .css('width', img.width())
						   .css('height', img.height());

				//allow drag around		  
				$detailWrap.draggable({
					containment : "#board",
					scroll: false,
					delay : 10,
				});


				// $detailWrap.addClass("shadow-strong");
				$detailWrap.find(".texts").css("cursor","move");
				scope.isPlayingVideo = true;   
			/*			   
				var player = new nn.Player(pid);

				player.controls = 1;
				// console.log(player);
				player.ready().then(function(){
					// console.log("ready");
					player.loadVideoById(vid);
					$(player).one("playing", function(){
						$detailWrap.draggable({
							containment : "#board",
							scroll: false,
							delay : 10,
						});
						// $detailWrap.addClass("shadow-strong");
						$detailWrap.find(".texts").css("cursor","move");
						scope.$apply(function(){
							scope.isPlayingVideo = true;
						});
					});
				});
			*/
			}
			scope.stopVideo = function(){
				$playerHolder.removeAttr("style");
				$player.attr("src", "").hide();
				var img = $detailWrap.find(".img");
				img.show();
				enableHover();
				$detailWrap.draggable("destroy");
				$detailWrap.removeAttr("style");
				// $detailWrap.removeClass("shadow-strong");
				$detailWrap.find(".texts").removeAttr("style");
				$timeout(function(){
					scope.isPlayingVideo = false;
					scope.showDetail = false;
				}, 1);
			}
			scope.hasImageArea = false;
			scope.showDetail = false;
			// console.log(data);
			var timer, timer1;
			var enableHover = function(){
				$(ele).unbind();
				$(ele).on("mouseover", function(){
					if(timer1){
						$timeout.cancel(timer1);
					}

					scope.$apply(function(){
						scope.showOpt = true;
					});

					if(timer){
						$timeout.cancel(timer)
					}

					timer = $timeout(function(){
						scope.showDetail = true;
						_c.log(scope.data);
					}, 600);
				});
				$(ele).on("mouseout", function(){
					timer1 = $timeout(function(){
						scope.showOpt = false;
						scope.showDetail = false;
					}, 1);

					if(timer){
						$timeout.cancel(timer)
					}
				});
			}

			enableHover();

			$(ele).find("img.thumb").bind('load', function() {
                $(this).show();
                scope.$apply(function(){
                	scope.hasImageArea = true;
                });
            });

			scope.iconLoaded = false;
            $(ele).find(".icon img").bind("load", function(){
            	scope.$apply(function(){
            		scope.iconLoaded = true;
            	});
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
				var type = attrs.data;
				var allRects = type === "link" ? gridRects.link : gridRects.folder;
				var data = type === "link" ? scope.link : scope.folder;
				var service = type === "link" ? apiService.linkService : apiService.folderService;
				var preview = type === "link" ? ctrlScope.dragPreview.link : ctrlScope.dragPreview.folder;
				var ref = type === "link" ? scope.link : scope.folder;
				//console.log(ref.grid);
				var gs = gridService;
				var originRect, originGrid, dragRect, selectedGrid, $ele;
				var sideWidth = gs.sideWidth;
				var zIndex = 0;
				var timeout;
				var isAvailable = false;
				var $selectedFolder, $folders = $(".folder");

				scope.$apply(function(){
					ref.dragging = false;
				});

				$(ele).draggable({
					containment : "#board",
					scroll: false,
					delay : 100,
					start : function(e, ui){
						$ele = $(ele);
						originRect = rects.getDomRect($ele);
						dragGrid = undefined;
						originGrid = data.grid;
						zIndex = $ele.css("z-index");
						$ele.css("z-index", 100);

						scope.$apply(function(){
							ref.dragging = true;
						});
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
							$folders.removeClass("selected");
						}else{
							preview.show = false;
							if(type === "link"){
								$selectedFolder = allRects.findDragOverFolder(dragRect);
								$folders = $(".folder");

								$folders.removeClass("selected");
								if($selectedFolder !== false){
									$selectedFolder.addClass("selected");
								}
							}
						}
						ctrlScope.$apply();
					},
					stop : function(e, ui){

						$(ele).trigger("mouseout");
						ref = type === "link" ? scope.link : scope.folder;
						ref.dragging = false;
						preview.show = false;
						$selectedFolder = $(".folder.selected");
						if($selectedFolder.length === 1){
							//do drop folder
						}
						$folders.removeClass("selected");
						$ele.css("z-index", zIndex);

						dragRect = rects.getDomRect($ele);
						dragGrid = allRects.findDragRectGrid(
							originGrid,
							dragRect
						);

						isAvailable = allRects.gridAvailable(dragGrid);
						//if there is a selected grid and the selected grid is not occupied
						//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						if(isAvailable){
							/*	
							_c.log(ref);
							_c.log(dragGrid);
							*/
							ref.grid = dragGrid;
							scope.$apply();

							clearTimeout(timeout);
							timeout = setTimeout(function(){
								service.save(ref).then(function(res){
								});
							}, 100);

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