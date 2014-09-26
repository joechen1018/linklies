'use strict';

goog.require('goog.math.Rect');
app.controller("desktopCtrl", function($scope, $rootScope, $timeout, $http, $sce,
									    keyboardManager, resize, gridSystem, gridRects, gapiService,
									    apiService, uuid, apiParser, popupData){
	var $allElements,
		$desk = $('#desktop-view'),
		timeout,
		rs = resize;

	var dragTimer;	
	$(document).on('dragover', function(e) {
	    var dt = e.originalEvent.dataTransfer;
	    if(dt.types != null && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'))) {
	        $("#dropzone").show();
	        window.clearTimeout(dragTimer);
	    }
	});	

	$(document).on('dragleave', function(e) {
	    dragTimer = window.setTimeout(function() {
	        $("#dropzone").hide();
	    }, 25);
	});

	//** 100ms after controller constructed
	var init = function(){

		//** enable tooltip
		var enablePlugins = function(){
			$(document).tooltip();
		}

		//** get distance between 2 points
		var lineDistance = function(point1, point2){
			var xs = 0;
			  var ys = 0;
			  xs = point2.x - point1.x;
			  xs = xs * xs;
			  ys = point2.y - point1.y;
			  ys = ys * ys;
			  return Math.sqrt( xs + ys );
		}

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
		});

		if(glob.requireSign === true){
		}

		$timeout(function(){
			$("body").css("overflow", "auto");
			$("#bg-loading").delay(10).hide();
			gridSystem.update();
		}, 100);

		$('body').filedrop({
		    fallback_id: 'upload_button',   // an identifier of a standard file input element, becomes the target of "click" events on the dropzone
		    url: 'upload.php',              // upload handler, handles each file separately, can also be a function taking the file and returning a url
		    paramname: 'userfile',          // POST parameter name used on serverside to reference file, can also be a function taking the filename and returning the paramname
		    withCredentials: true,          // make a cross-origin request with cookies
		    data: {
		        param1: 'value1',           // send POST variables
		        param2: function(){
		            return calculated_data; // calculate data at time of upload
		        },
		    },
		    headers: {          // Send additional request headers
		        'header': 'value'
		    },
		    error: function(err, file) {
		        switch(err) {
		            case 'BrowserNotSupported':
		                alert('browser does not support HTML5 drag and drop')
		                break;
		            case 'TooManyFiles':
		                // user uploaded more than 'maxfiles'
		                break;
		            case 'FileTooLarge':
		                // program encountered a file whose size is greater than 'maxfilesize'
		                // FileTooLarge also has access to the file which was too large
		                // use file.name to reference the filename of the culprit file
		                break;
		            case 'FileTypeNotAllowed':
		                // The file type is not in the specified list 'allowedfiletypes'
		                break;
		            case 'FileExtensionNotAllowed':
		                // The file extension is not in the specified list 'allowedfileextensions'
		                break;
		            default:
		                break;
		        }
		    },
		    allowedfiletypes: ['image/jpeg','image/png','image/gif'],   // filetypes allowed by Content-Type.  Empty array means no restrictions
		    allowedfileextensions: ['.jpg','.jpeg','.png','.gif'], // file extensions allowed. Empty array means no restrictions
		    maxfiles: 25,
		    maxfilesize: 20,    // max file size in MBs
		    dragOver: function() {
		        // user dragging files over #dropzone
		        $scope.$apply(function(){
		        	$scope.showOverlay = true;
		        });
		    },
		    dragLeave: function() {
		        // user dragging files out of #dropzone
		        $scope.$apply(function(){
		        	$scope.showOverlay = false;
		        });
		    },
		    docOver: function() {
		        // user dragging files anywhere inside the browser document window
		    },
		    docLeave: function() {
		        // user dragging files out of the browser document window
		    },
		    drop: function() {
		        // user drops file
		    },
		    uploadStarted: function(i, file, len){
		        // a file began uploading
		        // i = index => 0, 1, 2, 3, 4 etc
		        // file is the actual file of the index
		        // len = total files user dropped
		    },
		    uploadFinished: function(i, file, response, time) {
		        // response is the data you got back from server in JSON format.
		    },
		    progressUpdated: function(i, file, progress) {
		        // this function is used for large files and updates intermittently
		        // progress is the integer value of file being uploaded percentage to completion
		    },
		    globalProgressUpdated: function(progress) {
		        // progress for all the files uploaded on the current instance (percentage)
		        // ex: $('#progress div').width(progress+"%");
		    },
		    speedUpdated: function(i, file, speed) {
		        // speed in kb/s
		    },
		    rename: function(name) {
		        // name in string format
		        // must return alternate name as string
		    },
		    beforeEach: function(file) {
		        // file is a file object
		        // return false to cancel upload
		    },
		    beforeSend: function(file, i, done) {
		        // file is a file object
		        // i is the file index
		        // call done() to start the upload
		    },
		    afterAll: function() {
		        // runs after all files have been uploaded or otherwise dealt with
		    }
		});
	}

	var clearLinks = function(){
		for(var i = $scope.links.length - 1; i>-1; i--){
			if($scope.links[i].state && $scope.links[i].state.name == "paste-url"){
				$scope.links.splice(i, 1);
			}
		}
	}

	var onUserDataFetched = function(appData){
		var data = appData,
			user = data.User,
			links = data.Link,
			folders = data.Folder,
			phase,
			_try=function(e){var t;try{t=$.parseJSON(e)}catch(n){_c.warn("link type parse error");_c.warn(e);return{}}return t}

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
	//if(userData === undefined){
	if(true){	
		//apiService.getUser(uid).then(onUserDataFetched);
		onUserDataFetched(appData);
	}

	uid = uid.split("/");
	uid = uid[uid.length - 1];
	glob.user = false;

	
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
	$("#desktop-view").on("mousewheel", function(event) {
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

	$scope.popupData = popupData;

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

	$scope.openLink = function(link){
		if(link.view === 'video'){
            $scope.playVideo(link);
            return;
        }

        popupData.show = true;
        popupData.browser.show = true;
        popupData.browser.url = $sce.trustAsResourceUrl(link.url);
        popupData.player.show = false;

        $scope.popupData = popupData;

        //** prevent body scrolling
        $("body").css("overflow", "hidden");
	}

	$scope.playVideo = function(link){
		var vid = link.type.videoId,
            tmp = link.type.embedUrl,
            src = tmp.replace("{{VIDEO_ID}}", vid);

        console.log(link);
        popupData.show = true;
        popupData.player.src = $sce.trustAsResourceUrl(src);
        popupData.player.show = true;
        popupData.browser.show = false;

        $scope.popupData = popupData;

        //** prevent body scrolling
        $("body").css("overflow", "hidden");
	}

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
				if(typeof $scope.links[i].images === "array"){
					if($scope.links[i].images[0].length === 0){
						if($scope.links[i].thumb.length > 1){
							$scope.links[i].images[0] = $scope.links[i].thumb;
						}
					}
				}
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

	$rootScope.$on("stopVideo", function(e, link){
		applyFocus(link, getLinkIndex(link), false);
	});
});
