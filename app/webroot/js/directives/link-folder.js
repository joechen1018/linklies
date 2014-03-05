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

			scope.grids = gridSystem;
			scope.stateTemplate = 'templates/link.' + (data.state.name || "ready") + '.html';
			//scope.detailTemplate = 'templates/link.detail.html';
			scope.checkState = function(state){
				if(!scope.data) return false;
				if(state === scope.data.state.name) return true;
				return false;
			}
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
						zIndex : scope.showOpt ? 100 : 10
					}
				}
			}

			scope.onPasted = function(url){
				if(app.utils.isUrl(url)){

					scope.data.url = url;
					scope.data.state = {
						name : "loading"
					};

					var colorShiftIntv,
					initColorShifting = function(){
							blue = "#4b9884", green = "#aacc8e", yellow = "#faec0a", orange = "#fe9d04",
							duration = 200, 
							colors = [blue, orange, green, yellow],
							i = 0;

						colorShiftIntv = setInterval(function(){
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

						data = apiParser.linkFromDb(data);

						//_c.log($.type(scope.data.type));
						clearInterval(colorShiftIntv);

						scope.data = data;
						// scope.results = data.type.results;
						scope.$apply();
						// _c.log(scope.results);

						/*
						ctrlScope.$apply(function(){
							ctrlScope.links.push(scope.data);
						});
						*/

						linkService.save(data).then(function(rs){
							// console.log("saved");
							scope.data.id = rs.id;
							scope.$apply();
							$rootScope.$broadcast("linkCreationComplete", scope.data);
						});
					}).fail(function(){
						alert("failed");
					});
				}else{
					
				}
			}

			/*
			scope.$watch("data.ico", function(newVal, oldVal){
				if(newVal !== oldVal){
					_c.log(newVal, oldVal);
				}
			});
			*/

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
			scope.iconHover = false;
			scope.isPlayingVideo = false;
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
			scope.hasImageArea = false;
			scope.showDetail = false;
			// console.log(data);
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
						if(scope.detailTemplate != 'templates/link.detail.html')
							scope.detailTemplate = 'templates/link.detail.html';
					});

					timer = $timeout(function(){
						scope.$apply(function(){
							scope.showDetail = true;
						});
					}, 600);

					$rootScope.$broadcast("linkHover", scope.data);
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

			/*setTimeout(function(){
				_c.log($("#" + data.uuid + " img.thumb").length);
				$(document).on("load", "#" + data.uuid + " img.thumb", function(){
					_c.log("load");
					$(this).show();
	                $timeout(function(){
	                	scope.hasImageArea = true;
	                }, 1);
				});
			}, 1);*/
			
			$(ele).find("img.thumb").on('load', function() {
                
            });

			scope.iconLoaded = false;

			/*
			taskQueue.push(function(){
				$(ele).find(".icon img").attr("src", data.ico);
			});
			taskQueue.push(function(){
				$(ele).find(".img img.thumb").attr("src", data.ico);
			});*/
			
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

            setTimeout(function(){
            	if(!bl)
            		$(loader.events).trigger("error", [data.id]);
            }, 2000 +  (Math.random() * 1000));

           /* 
           $(loader.events).bind("reachedExpectation", function(){
            	$(ele).find(".img img.thumb").attr("src", data.thumb);
            });
           $(ele).find(".icon img, .img img.thumb").bind("load", function(){
            	loadCount++;
            	_c.log("loaded : " + loadCount);
            })
			*/
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

				//ctrlScope = scope;

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
				var zIndex = 0;
				var timeout;
				var isAvailable = false;
				var $selectedFolder, $folders = $(".folder");

				scope.$apply(function(){
					ref.dragging = false;
				});

				$(ele).draggable({
					containment : "#drag-containment",
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
						$ele.css("z-index", 10);

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