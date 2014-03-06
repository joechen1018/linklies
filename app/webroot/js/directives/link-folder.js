app.directive("lkFolder", function(gridSystem){
	return {
		restrict : "EA",
		templateUrl : "templates/folder.html",
		controller : function($scope){
			$scope.grids = gridSystem;
		},
		replace : true,
		scope: {
		    data : "="
		},
		link : function(scope, ele, attrs, ctrl){

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
.directive("lkLink", function(gridSystem, apiService, $rootScope, apiParser, $timeout, uuid){
	return {
		restrict : "EA",
		templateUrl : "templates/link.1.html",
		controller : function($scope){

		},
		scope : {
			data : "="
		},
		replace : true,
		link : function(scope, ele, attrs){
			// _c.log(scope.data);
			var grids = gridSystem,
				data = scope.data,
				linkService = apiService.linkService,
				ctrlScope = scope.$parent,
				$playerHolder, 
				$detailWrap,
				$imgArea,
				$ele = $(ele),
				$player;

			//** get $dom when render completed
			$timeout(function(){
				$playerHolder = $ele.find(".player-holder").eq(0);
				$detailWrap = $ele.find(".link-details").eq(0);
				$player = $playerHolder.find("iframe").eq(0);
				$imgArea = $ele.find(".imgArea").eq(0);

				//** hide img area if no thumb
				if(data.thumb === "") $imgArea.hide();

			}, 500);


			scope.templates = {};
			scope.templates.state = 'templates/link.' + (data.state.name || "ready") + '.html';
			scope.templates.detail = 'templates/link.detail.html';
			scope.grids = gridSystem;
			scope.showOpt = false;
			scope.iconHover = false;
			scope.isPlayingVideo = false;
			scope.hasImageArea = false;
			scope.showDetail = false;

			if((function(){
				if(typeof data.type !== "object") return false
				return data.type.view === "search";
			})())
				scope.templates.type = 'templates/link.type.search.html';
			else
				scope.templates.type = 'templates/link.type.default.html';

			//** watch state to include state view
			scope.$watch("data.state", function(newVal, oldVal){
				scope.templates.state = 'templates/link.' + (data.state.name || "ready") + '.html';
			});

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
				if(app.utils.isUrl(url)){

					scope.data.url = url;
					scope.data.state = { name : "loading" };
					var colorShiftIntv;
					var initColorShifting = function($target){
							blue = "#4b9884", green = "#aacc8e", yellow = "#faec0a", orange = "#fe9d04",
							duration = 400, 
							colors = [blue, orange, green, yellow],
							i = 0;

						colorShiftIntv = setInterval(function(){
							$target.animate({
								backgroundColor : colors[i%colors.length]
							}, duration);
							i++;
						}, duration);
					}
					setTimeout(function(){
						initColorShifting($(ele).find(".no-icon"));
					}, 10);
					
					linkService.create(url).then(function(data){

						//** use new data but keep a copy of the old
						var odata = scope.data;

						//** attribute that we will use from old
						var list = ["id", "dragging", "grid", "thumb", "url", "user_id", "username_id", "uuid"];
						for(var i in odata){
							for(var j = 0; j<list.length; j++){
								if(i == list[j]){
									data[i] = odata[list[j]];
								}
							}
						}

						//** parse from string to object etc
						data = apiParser.linkFromDb(data);

						//** stop color animation
						clearInterval(colorShiftIntv);

						//** update view	
						scope.$apply(function(){
							scope.data = data;	
							//** hide img area if no thumb
							if(!data.thumb){
								$imgArea.hide();
							}else{
								scope.hasImageArea = true;
							}
						});

						linkService.save(data).then(function(rs){
							//** pass the id to data
							scope.$apply(function(){
								scope.data.id = rs.id;
							});
							//** notify controller level
							$rootScope.$broadcast("linkCreationComplete", scope.data);
						});
					})
					.fail(function(){
						//** notify controller level
						$rootScope.$broadcast("linkCreationFailed", scope.data);
					});
				}else{
					
				}
			}

			scope.removeResult = function($index){
				var type = scope.data.type;
				if(type.results){
					//_c.log(type.results);
					type.results.splice($index, 1);
					scope.data.type = type;

					//** save the data
					linkService.save(scope.data).then(function(rs){
						console.log("saved");
						// console.log(rs);
					});
				}else{
					_c.warn("type result not found")
				}
			}

			scope.removeLink = function(){
				$rootScope.$broadcast("removeLink", scope.data.uuid || scope.data.id);
				//$(_events).trigger("removeLink", [scope.data.id || scope.data.uuid])
			}

			scope.openPage = function(){
				$rootScope.$broadcast("openPage", scope.data.url);
			}

			scope.playVideo = function(){

				//** prevent detail hidden when mouse out
				$(ele).unbind();

				var type = scope.data.type;
				//** hide displayed image
				var img = $detailWrap.find(".img");
				img.hide();

				//** embed iframe player
				var src = utils.replace(type.embedUrl, {
					"VIDEO_ID" : type.videoId
				});

				$player.attr("src", src);
				$player.show();

				//** player size equal to the image size
				$playerHolder.css('top', img.position().top)
						   .css('width', img.width())
						   .css('height', img.height());

				//** allow drag around		  
				$detailWrap.draggable({
					containment : "#board",
					scroll: false,
					delay : 10,
				});


				$detailWrap.find(".texts").css("cursor","move");
				scope.isPlayingVideo = true;   
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
			
			var timer, timer1, timer3;
			var enableHover = function(){
				$(ele).unbind();
				$(ele).on("mouseenter", function(){
					$timeout.cancel(timer1);
					$timeout.cancel(timer);
					$timeout.cancel(timer3);

					scope.$apply(function(){
						scope.showOpt = true;
					});

					scope.$apply(function(){
						if(scope.templates.detail != 'templates/link.detail.html')
							scope.templates.detail = 'templates/link.detail.html';
					});

					timer = $timeout(function(){
						scope.$apply(function(){
							scope.showDetail = true;
						});
					}, 600);

					//$rootScope.$broadcast("linkHover", scope.data);
				});
				$(ele).on("mouseleave", function(){
					timer1 = $timeout(function(){
						scope.showOpt = false;
						scope.showDetail = false;
					}, 1);

					$timeout.cancel(timer3);
					timer3 = $timeout(function(){
						/*linkService.save(scope.data).then(function(rs){
							console.log("saved");
							// console.log(rs);
						});*/
					}, 6000);

					$timeout.cancel(timer);
				});
			}

			enableHover();
			scope.iconLoaded = false;
			
			//** try load the ico, notify app.js when request succeeded or failed
			var bl = false;
            $(ele).find(".icon img")
            .bind("load", function(){
            	bl = true;
            	$(loader.events).trigger("success", [data.id]);
            	$timeout(function(){
            		scope.iconLoaded = true;
            		scope.$apply();
            	}, 1);
            })
            .bind("error", function(){
            	$(ele).find(".no-icon").show();
            	$(ele).find(".icon").hide();

            	$(loader.events).trigger("error", [data.id]);
            });

            //** maxinum load time 2~3 sec, report error when exceeded
            setTimeout(function(){
            	if(!bl)
            		$(loader.events).trigger("error", [data.id]);
            }, 2000 +  (Math.random() * 1000));
		}
	}
})
.directive("lkDrag", function(gridSystem, gridRects, apiService, $timeout){
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

				var rects = gridRects;
				var type = attrs.data;
				var allRects = type === "link" ? gridRects.link : gridRects.folder;
				var data = type === "link" ? scope.link : scope.folder;
				var service = type === "link" ? apiService.linkService : apiService.folderService;
				var preview = type === "link" ? ctrlScope.dragPreview.link : ctrlScope.dragPreview.folder;
				var ref = type === "link" ? scope.link : scope.folder;
				//console.log(ref.grid);
				var gs = gridSystem;
				var originRect, originGrid, dragRect, selectedGrid, $ele;
				var sideWidth = gs.defaults.sideWidth;
				var timeout;
				var isAvailable = false;
				var $selectedFolder, $folders = $(".folder");

				scope.$apply(function(){
					ref.dragging = false;
				});

				$(ele).draggable({
					containment : "#drag-containment",
					scroll: false,
					delay : 10,
					start : function(e, ui){

						$ele = $(ele);
						originRect = rects.getDomRect($ele);
						dragGrid = undefined;
						originGrid = data.grid;
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
						dragRect = rects.getDomRect($ele);
						dragGrid = allRects.findDragRectGrid(
							originGrid,
							dragRect
						);

						isAvailable = allRects.gridAvailable(dragGrid);
						//if there is a selected grid and the selected grid is not occupied
						if(isAvailable){
							/*	
							_c.log(ref);
							_c.log(dragGrid);
							*/
							ref.grid = dragGrid;
							if($.type(ref.type) === "string"){
								ref.type = $.parseJSON(ref.type);
							}
							scope.$apply();
							service.save(ref);

							/*clearTimeout(timeout);
							timeout = setTimeout(function(){
								.then(function(res){

								});
							}, 100);*/

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