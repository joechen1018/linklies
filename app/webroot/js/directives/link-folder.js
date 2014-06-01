app.directive("lkFolder", function(gridSystem, $rootScope, apiService){
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

			var grids = gridSystem,
				$ele = $(ele),
				mousetimer,
				gRect = goog.math.Rect,
				$folder = $(ele);

			//excecute mouse enter/leave binding	
			var bindMouseEvents = function(){
				$ele.bind("mouseenter", function(){
					var $folder = $(ele),
						$list = $folder.find(".link-list").eq(0),
						left = $folder.offset().left,
						top = $folder.offset().top,
						fid = $folder.attr("id").split("-")[1];

					$folder.css("z-index", 1000);

					scope.linkList.show = true;

					$(".arrow").hide();
					$(".arrow").css("top", top + $folder.height()/2 - 10);

					//folder is on right side of the screen
					if(left > $(window).width() / 2){
						//show link list on the left of the folder
						$list.css("left", left - 419);
						$(".arrow-right").show();

					//folder is on left side of the screen	
					}else{
						//show link list on the right of the folder
						$list.css("left", left + $folder.width() );
						$(".arrow-left").show();
					}

					apiService.folderService.getLinks(fid).then(function(arr){
						if(arr.length > 0){
							scope.$apply(function(){
								scope.linkList.content = arr;
							});
						}
					});
				});

				$ele.bind("mouseleave", function(e){
					// var mouseRect = new goog.math.Rect(e.pageX-5, e.pageY-5, e.pageX+5, e.pageY+5);
					// var linksRect = new goog.math.Rect($linkList.offset().left, 0, $linkList.width(), $linkList.height());
					// var bool = linksRect.intersects(mouseRect);
					if(true){
						scope.$apply(function(){
							scope.linkList.show = false;
							$folder.css("z-index", 2);
						});
					}
				});
			}	

			//hide linkList before dragging	
			$ele.bind("dragStart", function(){
				console.log("start");
				$ele.unbind("mouseenter");
				$ele.unbind("mouseleave");

				scope.$apply(function(){
					scope.linkList.show = false;
				});
			});

			//bind mouse enter/leave events after drag
			$ele.bind("dragStop", function(){
				console.log("stop");
				bindMouseEvents();
			});

			//bind mouse enter/leave events
			bindMouseEvents();

			//** LinkList
			scope.linkList = {};
			scope.linkList.url = root + "templates/folder.links.html";
			scope.linkList.show = false;
			scope.linkList.arrowTop = 10;
			//****

			// scope.links = scope.data.Link;
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
				temps = {
					state : function(){
						return 'templates/link.' + (data.state.name || "ready") + '.html';
					},
					detail : 'templates/link.detail.html',
					type : {
						'default' : 'templates/link.type.default.html',
						'search' : 'templates/link.type.search.html'
					}
				},
				$playerHolder, 
				$detailWrap,
				$imgArea,
				$img,
				$ele = $(ele),
				$player;

			scope.templates = {};
			scope.templates.state = 'templates/link.' + (data.state.name || "ready") + '.html';
			//scope.templates.detail = 'templates/link.detail.html';
			scope.grids = gridSystem;
			scope.showOpt = false;
			scope.iconHover = false;
			scope.isPlayingVideo = false;
			scope.showDetail = false;

			//** whether the link has a thumb
			scope.hasImageArea = true;
			if(data.thumb === ""){
				scope.hasImageArea = false;
			}

			//** watch state to include state view
			scope.$watch("data.state", function(newVal, oldVal){
				scope.templates.state = temps.state();
			});

			// scope.$watch("data.title", function(newVal, oldVal){
			// 	console.log(newVal);
			// });

			$ele.find("span.title").change(function(){
				console.log($(this).text());
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

					setTimeout(function(){
						startColorShifting($ele.find(".state-loading .no-icon"));
					}, 100);
					
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
						stopColorShifting();

						//** update view	
						scope.$apply(function(){
							scope.data = data;
							scope.hasImageArea = (function(){
								if(data.thumb === undefined) return false;
								if(typeof data.thumb === "string")
									if(data.thumb.length === 0)
										return false;
								return true;
							})();
						});

						linkService.save(data).then(function(rs){
							//** pass the id to data
							scope.$apply(function(){
								scope.data.id = rs.id;
							});
							//** notify controller level
							$rootScope.$broadcast("linkCreationComplete", data);
						});
					})
					.fail(function(){
						_c.log("fail");
						//** notify controller level
						$rootScope.$broadcast("linkCreationFailed", scope.data);
					});
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
				$rootScope.$broadcast("openPage", scope.data);
			}

			scope.playVideo = function(){

				var type = scope.data.type;

				//** prevent detail hidden when mouse out
				$ele.unbind("mouseenter");
				$ele.unbind("mouseleave");

				//** hide displayed image
				$detailWrap = $ele.find(".link-details").eq(0);
				$img = $detailWrap.find(".img");
				$img.hide();

				//** embed iframe player
				var src = utils.replace(type.embedUrl, {
					"VIDEO_ID" : type.videoId
				});


				$player = $ele.find(".player-holder iframe").eq(0);
				$player.show();
				$player.attr("src", src);

				//** player size equal to the image size
				$playerHolder = $(".player-holder");
				$playerHolder.css('top', $img.position().top)
							 .css('width', $img.width())
							 .css('height', $img.height());

				//** allow drag around		  
				$detailWrap.draggable({
					containment : "#board",
					scroll: false,
					delay : 10,
				});

				//** higher than hovered link(100)
				$ele.css('z-index', '101')

				//** let user know the pannel is draggable
				$detailWrap.find(".texts").css("cursor","move");


				scope.isPlayingVideo = true;   
			}

			scope.stopVideo = function(){

				//** enable hover again
				enableHover();

				//** link-detail & img
				$detailWrap = $ele.find(".link-details").eq(0);
				$img = $detailWrap.find(".img");
				$img.show();

				//** set things back
				$playerHolder.removeAttr("style");
				$player.attr("src", "").hide();
				$ele.css('z-index', '');

				$detailWrap.draggable("destroy");
				$detailWrap.removeAttr("style");
				$detailWrap.find(".texts").removeAttr("style");

				$timeout(function(){
					scope.isPlayingVideo = false;
					scope.showDetail = false;
				}, 1);

				//** focus me for 30 sec
				$rootScope.$broadcast("stopVideo", scope.data);
			}

			var thumbUrl;
			scope.getThumb = function(){
				//console.log(data);
				if(typeof data.type === "object"){
					if(data.type.name.indexOf("google.docs") !== -1){
						if(thumbUrl){
							return thumbUrl;
						}else{
							if(data.key === undefined || data.key === ""){
								data.key = __.getDocKey(data.url);
							}
							var request = gapi.client.drive.files.get({
			                    'fileId': data.key
			                });
			                request.execute(function(res) {
			                    $ele.find(".thumb").attr("src", res.thumbnailLink);
			                    data.thumb = res.thumbnailLink;
			                    apiService.linkService.save(data);
			                    thumbUrl = res.thumbnailLink;
			                });
						}
						return "";
					}
				}
				return data.thumb;
			}
			
			var timer, timer1, timer3;
			var enableHover = function(){

				//** clear before bind
				$ele.unbind("mouseenter");
				$ele.unbind("mouseleave");

				//**　
				$ele.on("mouseenter", function(){

					$timeout.cancel(timer1);
					$timeout.cancel(timer);
					$timeout.cancel(timer3);

					scope.$apply(function(){
						scope.showOpt = true;
						if(scope.templates.detail != temps.detail)
							scope.templates.detail = temps.detail;

						//** if type is object and its view attr equals to 'search'
						if((function(){
							if(typeof data.type !== "object") return false
							return data.view === "search";
						})()){
							scope.templates.type = temps.type.search;
							//_c.log(scope.templates.type);
						}
						else
							scope.templates.type = temps.type['default'];
						});

					timer = $timeout(function(){
						scope.$apply(function(){
							scope.showDetail = true;
						});
					}, 600);

					//$rootScope.$broadcast("linkHover", scope.data);
				});
				$ele.on("mouseleave", function(){
					timer1 = $timeout(function(){
						scope.showOpt = false;
						scope.showDetail = false;
						scope.templates.detail = '';
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
.directive("lkDrag", function(gridSystem, gridRects, apiService, $timeout, $rootScope){
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

				var _b = function(type){return type === "link"}
				var rects = gridRects,
					type = attrs.data,
					allRects = _b(type) ? gridRects.link : gridRects.folder,
					data = _b(type) ? scope.link : scope.folder,
					service = _b(type) ? apiService.linkService : apiService.folderService,
					preview = _b(type) ? ctrlScope.dragPreview.link : ctrlScope.dragPreview.folder,
					ref = _b(type) ? scope.link : scope.folder,
					gs = gridSystem,
					originRect, 
					originGrid, 
					dragRect, 
					selectedGrid, 
					sideWidth = gs.defaults.sideWidth,
					timeout,
					isAvailable = false,
					$ele = $(ele),
					$selectedFolder, $folders = $(".folder");

				scope.$apply(function(){
					ref.dragging = false;
				});

				$(ele).draggable({
					containment : "#drag-containment",
					scroll: false,
					delay : 10,
					//handle : type === 'link' ? ".icon, .no-icon" : "",
					start : function(e, ui){

						$ele = $(ele);
						$ele.trigger("dragStart");
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
						isAvailable = allRects.gridAvailable(dragGrid, originGrid);
						//if(selectedGrid !== undefined && !gs.occupied.link(selectedGrid)){
						if(isAvailable){
							preview.show = true;
							preview.grid = dragGrid;
							$folders.removeClass("selected");
						}else{
							preview.show = false;
							if(_b(type)){
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

						$ele.trigger("dragStop");
						$(ele).trigger("mouseout");
						ref = type === "link" ? scope.link : scope.folder;
						ref.dragging = false;
						preview.show = false;
						$selectedFolder = $(".folder.selected");

						// _c.log($selectedFolder);
						//** do drop link to folder
						if($selectedFolder.length === 1){
							// _c.log(ref);
							//** extend type varification later
							var folderType = $selectedFolder.hasClass("video") ? "video" : "web";
							var saveToFolder = function(folderId, link){
								$rootScope.$broadcast("removeLink", link.id);
								link.folder_id = folderId;
								// _c.log(link);
								$selectedFolder.addClass("saving");
								apiService.linkService.save(link).then(function(res){
									$selectedFolder.removeClass("saving");
								});
							}
							if(folderType === "video"){
								if(ref.view === "video"){
									saveToFolder($selectedFolder.attr("id").split("-")[1], ref);
								}
							}else{
								saveToFolder($selectedFolder.attr("id").split("-")[1], ref);
							}
						}

						$folders.removeClass("selected");
						dragRect = rects.getDomRect($ele);
						dragGrid = allRects.findDragRectGrid(
							originGrid,
							dragRect
						);

						isAvailable = allRects.gridAvailable(dragGrid, originGrid);
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