app.directive("imgWatcher", function(){
	return {
		link : function(scope, ele, attrs){
			ele.bind("load", function(e){
				ele.show();
			});
			ele.bind("error", function(){
				ele.hide();
			});
		}
	}
})
.directive("lkFolder", function(gridSystem, $rootScope, apiService, apiParser){
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
				linkListData,
				$folder = $(ele),
				//* template reload count
				count = 0;

			//** excecute mouse enter/leave binding	
			var bindMouseEvents = function(){

				$ele.bind("mouseenter", function(){

					var $folder = $(ele),
						$list = $folder.find(".link-list").eq(0),
						left = $folder.offset().left,
						top = $folder.offset().top - $("body").scrollTop(),
						fid = $folder.attr("id").split("-")[1];

					//* move folder to front	
					$folder.css("z-index", 1000);

					//*** arrow position
					// $(".arrow").hide().css("top", top + 75);

					//* folder is on right side of the screen
					if(left > $(window).width() / 2){
						//show link list on the left of the folder
						$list.css({
							"left" : left - 515,
							"top" : top - ($list.height() - $folder.height())/2
						});

						//** show arrow
						$(".arrow-right").show().css({
							top : $list.position().top  + ($list.height()/2)
						});

						$folder.find(".link-list")
							   .removeClass("left")
							   .addClass("right");

						scope.$apply(function(){
							scope.dir = "right";
						});	   

					//* folder is on left side of the screen	
					}else{
						//show link list on the right of the folder
						$list.css({
							"left" : left + 150,
							"top" : top - ($list.height() - $folder.height())/2
						});

						$(".arrow-left").show().css({
							top : $list.position().top + ($list.height()/2)
						});

						$folder.find(".link-list")
							   .removeClass("right")
							   .addClass("left");

						scope.$apply(function(){
							scope.dir = "left";
						});	   
					}

					//** class 'reload' applied to dom by lkDrag directive 
					//   when new link is dropped onto the folder
					if(linkListData === undefined || $folder.hasClass("reload")){
						$folder.removeClass("reload");
						apiService.folderService.getLinks(fid).then(function(arr){
							scope.$apply(function(){
								//** parse link
								for(var i = 0; i<arr.length; i++){
									arr[i] = apiParser.linkFromDb(arr[i]);
								}
								linkListData = arr;
								scope.linkList.content = arr;
								//scope.linkList.selectedLink = scope.linkList.content[0];
							});
						});
					}
					
					//*** top buttons positioning
					$(".top-buttons li").each(function(){
						var $span = $(this).find("a>span");
						$span.css("padding-left", ($(this).width() - $span.width())/2 + 8);
					});

					scope.$apply(function(){
						scope.linkList.show = true;
					});
				});

				$ele.bind("mouseleave", function(e){
					// var mouseRect = new goog.math.Rect(e.pageX-5, e.pageY-5, e.pageX+5, e.pageY+5);
					// var linksRect = new goog.math.Rect($linkList.offset().left, 0, $linkList.width(), $linkList.height());
					// var bool = linksRect.intersects(mouseRect);
					if(true){
						$folder.css("z-index", 2);
						scope.$apply(function(){
							scope.linkList.show = false;
							scope.linkList.selectedLink = undefined;
						});
					}
				});
			}	

			//hide linkList before dragging	
			$ele.bind("dragStart", function(){
				$ele.unbind("mouseenter");
				$ele.unbind("mouseleave");

				scope.$apply(function(){
					scope.linkList.show = false;
				});
			});

			//bind mouse enter/leave events after drag
			$ele.bind("dragStop", function(){
				bindMouseEvents();
			});

			$ele.bind("dblclick", function(){
				var $folder = $ele;
				var $input = $ele.find("#edit-name");
				var $name = $ele.find("p.name");
				var tmpVal = $name.text();

				$name.hide();
				$input.show()
					  .focus();

				$input.bind("focusout", function(){

					$input.unbind();
					$input.hide();
					$name.show();

					if($input.val().length > 0){
						//assign edited result to name
						scope.$apply(function(){
							scope.data.name = $input.val();
						});
						apiService.folderService.saveName(scope.data.id, $input.val()).then(function(res){
							// console.log(res);
						});

					}else{

					}
				});

				return false;
			});

			//** prevent parent scrolling
			$ele.on("mousewheel", ".link-list-items", function(){
				$(this).mousewheelStopPropagation();
			});

			//** bind mouse enter/leave events
			bindMouseEvents();

			scope.onPreviewImgLoad = function(){
				var $img = $ele.find("img.preview");
			}

			scope.onRightClick = function($event){
				var context = {};
				context = {
					"show" : true,
					"class" : 'folder',
					"left" : $event.pageX,
					"top" : $event.pageY,
					"href" : scope.linkList.folderUrl,
					"ref" : scope.data
				};
				$rootScope.$broadcast("showFolderMenu", context);
				$event.stopPropagation();
			}

			//** LinkList
			scope.linkList = {};
			scope.linkList.url = root + "templates/folder.links.html";
			scope.linkList.show = false;
			scope.linkList.arrowTop = 10;
			scope.linkList.folderUrl = root + "folder/" + scope.data.hash;
			// scope.linkList.selectedIndex = 0;
			//****

			var hoverTimer;
			scope.onListItemHover = function(i){
				hoverTimer = setTimeout(function(){
					scope.$apply(function(){
						scope.linkList.selectedIndex = i;
						scope.linkList.selectedLink = scope.linkList.content[i];
						scope.linkList.selectedLink.hover = true;
					});
				}, 10);
			}

			scope.onListItemOut = function(){
				scope.linkList.selectedLink.hover = false;
				clearTimeout(hoverTimer);
			}

			scope.onTitleClick = function(e, link){
				if(link.allowIframe){
					e.preventDefault();
					$rootScope.$broadcast("openPage", link);

					//* hide folder links
					$folder.css("z-index", 2);
					scope.$apply(function(){
						scope.linkList.show = false;
					});
				}else{

				}
			}
			scope.deleteLink = function(link){
				var list = scope.linkList.content;
				if(confirm("Delete link?")){
					for(var i = 0; i<list.length; i++){
						if(list[i].uuid === link.uuid){
							scope.linkList.content.splice(i, 1);
							apiService.linkService.remove(link.uuid).then(function(res){
								console.log(res)
							});
						}
					}
				}
			}

			scope.deleteFolder = function(){
				if(confirm("Are you sure you wish to delete this folder? You have " + scope.linkList.content.length + " links in this folder.")){
					$rootScope.$broadcast("deleteFolder", scope.data.id);
				}
			}
			// scope.links = scope.data.Link;
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

			scope.openPopup = function(tab, link){
				$rootScope.$broadcast("showPopup", tab, link);
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
			if(data.images === "" || data.images === []){
				scope.hasImageArea = false;
			}

			//** watch state to include state view
			scope.$watch("data.state", function(newVal, oldVal){
				scope.templates.state = temps.state();
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
					
					linkService.create(url).then(function(data, findValidThumbsTask){

						//** when finish finding valid thumbs
						findValidThumbsTask.then(function(thumbs, rs){
							var str = thumbs.join(",");
							linkService.saveLinkThumbs(str, rs.uuid).then(function(rs){
								scope.$apply(function(){
									scope.data.images = rs.data.Link.images.split(",");
									$rootScope.$broadcast("findValidThumbsTaskComplete", scope.data);
								});
							});
						});


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

						gapi.client.load('urlshortener', 'v1',function(){
							var request = gapi.client.urlshortener.url.insert({
						      'resource': {
							      'longUrl': data.url
							    }
						    });
						    request.execute(function(response){
						        if(response.id != null){
						        	//console.log(response.id);

						        	//** get shorten url
						        	data["short_url"] = response.id;

						        	//** save
						        	linkService.save(data).then(function(rs){
										//** pass the id to data
										scope.$apply(function(){
											scope.data.id = rs.id;
											//** notify controller
										});
										$rootScope.$broadcast("linkCreationComplete", data);
									});

									//** getting shorten url info
									// request = gapi.client.urlshortener.url.get({
								 //        'shortUrl': data["short_url"],
								 //        'projection': 'FULL'
								 //   	});
								 //   	request.execute(function(res){
								 //   		console.log(res);
								 //   	});

						        }else{
						            console.log("error: creating short url n"+ response.error);

						            //** if creating short url fails, still save the link
						            linkService.save(data).then(function(rs){
										//** pass the id to data
										scope.$apply(function(){
											scope.data.id = rs.id;
										});
										$rootScope.$broadcast("linkCreationComplete", data);
									});
						        }
						    });
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

			//** removal be done in desktopController
			scope.removeLink = function(){
				$rootScope.$broadcast("removeLink", scope.data.uuid || scope.data.id);
			}

			//** open iframe browser
			scope.openPage = function(){
				$ele.css("z-index", 10);
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

			//** getThumb depreciated
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

			scope.openPopup = function(tab){
				$rootScope.$broadcast("showPopup", tab, scope.data);
			}

			scope.slideThumb = function(dir){
				data.thumbIndex += dir;
				if(data.thumbIndex < 0) data.thumbIndex = 0;
				if(data.thumbIndex >= data.images.length) data.thumbIndex = data.images.length - 1;
				var $holder = $ele.find(".img .holder");
				var $img = $holder.find("img").eq(data.thumbIndex);
				$holder.height($img.height());
				$holder.animate({
					left : -(data.thumbIndex * 330)
				}, 300, function(){
					apiService.linkService.save(data);
				});
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

					//** bring up link so detail will overlay other $elements
					$ele.css("z-index", 1000);

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
						}
						else
							scope.templates.type = temps.type['default'];
					});

					timer = $timeout(function(){
						scope.$apply(function(){
							scope.showDetail = true;

							//** get selected thumb height and assign it to the holder
							var $holder = $ele.find(".img .holder");
							var $img = $holder.find("img").eq(data.thumbIndex);
							setTimeout(function(){
								$holder.height($img.height());
								$holder.css({
									left : -(data.thumbIndex * 330)
								});
							}, 10);
						});
					}, 600);

					//$rootScope.$broadcast("linkHover", scope.data);
				});
				$ele.on("mouseleave", function(){
					//** setting z-index back
					$ele.css("z-index", 10);

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
            		scope.$apply(function(){
            			scope.iconLoaded = true;
            		});
            	}, 1);
            })
            .bind("error", function(){
            	$(ele).find(".no-icon").show();
            	$(ele).find(".icon").hide();

            	$(loader.events).trigger("error", [data.id]);
            });

            $ele.on("mouseenter", "h1.title", function(){
            	if(!scope.data.allowIframe){
            		$ele.find(".more>a").addClass("hover");
            	}
            });

            $ele.on("mouseleave", "h1.title", function(){
            	$ele.find(".more>a").removeClass("hover");
            });

            $ele.on("load", ".thumb-head img", function(){
            	console.log('load');
            });

            //** maxinum load time 2~3 sec, report error when exceeded
            /*setTimeout(function(){
            	if(!bl)
            		$(loader.events).trigger("error", [data.id]);
            }, 2000 +  (Math.random() * 1000));*/
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
						$ele.trigger("dragStart").css("z-index", 1000);
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

						$ele.trigger("dragStop").css("z-index", 10);
						$(ele).trigger("mouseout");
						ref = type === "link" ? scope.link : scope.folder;
						ref.dragging = false;
						preview.show = false;
						$selectedFolder = $(".folder.selected");

						//** do drop link to folder
						if($selectedFolder.length === 1){
							//** extend type varification later
							var folderType = $selectedFolder.hasClass("video") ? "video" : "web";
							var saveToFolder = function(folderId, link){
								//$rootScope.$broadcast("removeLink", link.id);
								var $link = $("#link-" + link.uuid);
								$link.hide();

								link.folder_id = folderId;
								$selectedFolder.addClass("saving");
								apiService.linkService.setLinkFolderId(link.id, folderId).then(function(res){
									$selectedFolder.addClass("reload");
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

							$folders.removeClass("selected");
							return;
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

							scope.$apply(function(){
								ref.grid = dragGrid;
								if($.type(ref.type) === "string"){
									ref.type = $.parseJSON(ref.type);
								}
							});

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