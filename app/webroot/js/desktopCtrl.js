
goog.require('goog.math.Rect');
app.service("grid", function($timeout){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];
	
	this.getGridWidth = function(){
		var viewportWidth = $(window).width() - 30;
		var num = Math.floor(viewportWidth/160);
		var extra = viewportWidth - num*160;
		return Math.round(150 + (extra/num));
	}

	this.findFolderRect = function(pos){

	}
	var getFolderRects = function(){
		var h = Math.ceil(getHGridNum() / 4);
		var v = getVGridNum();
		var rects = [], rect;
		for(var i = 0; i<h; i++){
			for(var j = 0; j<v; j++){
				rect = new goog.math.Rect(
					20 + j*(self.gridWidth + self.gridMargin),
					20 + i*(self.folderHeight + self.gridMargin),
					self.gridWidth,
					self.folderHeight
				);
				rect.grid = [j, i];
				rects.push(rect);
			}
		}
		//console.log(rects);
		return rects;
	}
	var getLinksRects = function(){
		var h = getHGridNum();
		var v = getVGridNum();
		var rects = [], rect;

		for(var i = 0; i<h; i++){
			for(var j = 0; j<v; j++){
				rect = new goog.math.Rect(
					20 + j*(self.gridWidth*2 + self.gridMargin),
					20 + v*(self.gridHeight + self.gridMargin),
					self.linkWidth,
					self.gridHeight
				);
				rects[i, j] = rect;
			}
		}
		return rects;
	}

	var getHGridNum = function(){
		var h = self.viewHeight;
		return Math.ceil((h - 40 - self.gridMargin) / (self.gridHeight + self.gridMargin));
	}

	var getVGridNum = function(){
		return Math.ceil(self.viewWidth / (self.gridWidth + self.gridMargin));
	}
	
	//this needs to be called after links and folders rendered
	this.getViewHeight = function(){
		var h = $("body").height() , eh = 0;
		$(".folder, .link").each(function(i, e){
			eh = $(e).offset().top + $(e).height();
			if(h < eh){
				h = eh;
			}
		});
		return h;
	}
	this.setViewHeight = function(h){
		self.viewHeight = h + 20;
	}
	this.getHLines = function(){
		var h = self.viewHeight;
		var n = Math.ceil((h - 40 - self.gridMargin) / (self.gridHeight + self.gridMargin));
		var a = [];
		for(var i = 0; i<n; i++)
			a.push({i : i});
		
		return a;
	}
	this.getVLines = function(){
		vlines = [];
		var n = Math.ceil($(window).width() / (self.gridWidth + self.gridMargin)) + 1;
		for(i = 0; i<n; i++)
			vlines.push({"i" : i});
		
		return vlines;
	}
	this.init = function(){

		self.gridHeight = 30;
		self.gridMargin = 10;

		this.update();
		// this.folderRects = getFolderRects();
		// this.linkRects = getLinksRects();
	}
	this.update = function(){

		self.gridWidth = self.getGridWidth();
		self.folderHeight = 4*self.gridHeight + 3*self.gridMargin;
		self.linkWidth = 2*self.gridWidth + self.gridMargin;

		self.viewWidth = $(window).width();
		self.viewHeight = self.newViewHeight || self.getViewHeight();
		self.newViewHeight = false;

		self.hlines = self.getHLines();
		self.vlines = self.getVLines();
		self.folderRects = getFolderRects();
		self.linkRects = getLinksRects();
	}
	this.updateViewHeight = function(){

	}
	this.init();
	
})
.controller("desktopCtrl", function($scope, $timeout, grid){
	var links = [], folders = [];
	var lastDragged;
	var init = function(){
		for(var i = 0; i<6; i++){
			links.push({
				id : "link-" + (i+1),
				grid : [0, 4+i],
				pageTitle : "Nina Simone - Feeling good (Nicolas Jaar edit) \"Nico's feeling Good\" - YouTube",
				thumb : "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQBdfgUT1fJTToGl&w=398&h=208&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FBkzvSf9NLTY%2Fhqdefault.jpg&cfs=1&upscale",
				contentTitle : "Nicolas Jaar - Sonar 2012 (full set)",
				from : "www.youtube.com",
				desc : "THIS IS THE FIRST 11 MINUTES OF THE DARKSIDE ALBUM. FOOTAGE WAS FILMED IN MONTICELLO, NY. RECORD WAS WRITTEN AND RECORDED AT OTHER PEOPLE STUDIOS, NY, STUDIO DE LA REINE, PARIS & THE BARN, GARRISON, NY."
			});

			folders.push({
				id : "folder-" + (i+1),
				type : i % 2 === 0 ? "" : "youtube",
				name : "test folder",
				grid : [i, 0],
				state : ""
			});
		}
	}

	init();

	$scope.links = links;
	$scope.folders = folders;
	$scope.grid = grid;
	$scope.folderPreviewGrid = [2, 1];
	$scope.showFolderPreview = false;
	$scope.linkPreviewGrid = [3, 4];
	$scope.showLinkPreview = false;

	var timeout;
	$(window).resize(function(){
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			grid.update();
			$scope.$apply();
		}, 300);
	});

	var findAvailableGrid = function(originRect, draggingRect){
		//find in all available rects, which has most intersection
		var folderRects = grid.folderRects, rect, intersection, area, max = {area : 0, grid : undefined};
		var linkRects = grid.linkRects;
		for(var i = 0; i<folderRects.length; i++){
			rect = folderRects[i];
			if(!goog.math.Rect.equals(rect, originRect)){
				if(rect.intersects(draggingRect)){
					intersection = goog.math.Rect.intersection(rect, draggingRect);
					area = intersection.width * intersection.height;
					if(area > max.area){
						max.area = area;
						max.grid = rect.grid;
					}
				}
			}
		}
		return max.grid;
	}
	var getRect = function($target){
		var offset = $target.offset();
		return new goog.math.Rect(offset.left, offset.top, $target.width(), $target.height());
	}
	//wait for folder directive construction
	$timeout(function(){

		var timeout;
		var originRect, draggingRect, availableGrid;
		
		$(".folder").draggable({
			start : function(e, ui){
				originRect = getRect($(this));
				availableGrid = undefined;
			},
			drag : function(e, ui){

				draggingRect = getRect($(ui.helper.context));
				availableGrid = findAvailableGrid(originRect, draggingRect);
				if(availableGrid !== undefined){
					$scope.$apply(function(){
						$scope.folderPreviewGrid = availableGrid;
						$scope.showFolderPreview = true;
					});
				}
			},
			stop : function(e, ui){

				var newHeight = ui.position.top + $(this).height();
				grid.newViewHeight = newHeight + 20;

				if(newHeight > grid.viewHeight){
					grid.update();
				}

				$scope.showFolderPreview = false;
				if(availableGrid !== undefined){
					for(var i = 0; i<$scope.folders.length; i ++){
						if($scope.folders[i].id == $(ui.helper.context).attr("id")){
							$scope.folders[i].grid = availableGrid;
						}
					}
				}
				$scope.$apply();
			}
		});		
	}, 100);
	
	// var timeout;
	// var margin = 20;
	// var gridWidth = grid.getGridWidth();
	// var folderHeight, linkWidth, gridMargin = 10, gridHeight = 30;
	// var update = function(){

	// 	gridWidth = grid.getGridWidth();
	// 	folderHeight = 4*$scope.gridHeight + 3*$scope.gridMargin;
	// 	linkWidth = 2*gridWidth + gridMargin;

	// 	$scope.$apply(function(){
	// 		$scope.gridWidth = gridWidth;
	// 		$scope.gridHeight = 30;
	// 		$scope.gridMargin = gridMargin;
	// 		$scope.folderHeight = folderHeight;
	// 		$scope.linkWidth = linkWidth;

	// 		$scope.hlines = grids[0];
	// 		$scope.vlines = grids[1];

	// 		createLinkFolders();
	// 		$scope.links = links;
	// 		$scope.folders = folders;	
	// 	});
	// }
})
.directive("folderDirective", function(grid){
	return function(scope, ele, attrs){
		return;
		$(ele).draggable({
			start : function(e, ui){
				$(this).data("originalPosition", ui.originalPosition);
				$(this).addClass("dragging");
			},
			drag : function(e, ui){

			},
			stop : function(e, ui){

				$(this).removeClass("dragging");
				grid.update();
				scope.$apply(function(){
					scope.grid = grid;
				});
				return;
				var pos;
				var opos = $(this).data("originalPosition");
				var dragged = $(this);
				if($(this).hasClass("folder")){
					pos = grid.findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = grid.findNearestPosForLink(ui.position.left, ui.position.top);
				}
				var allowReposition = true;
				$(".link, .folder").each(function(i, e){
					if(e != dragged[0]){
						area2 = {
							left : $(e).offset().left,
							top : $(e).offset().top,
							width : $(e).width(),
							height : $(e).height()
						}
						var intersects = new $.rect($(dragged)).intersects($(e));
						var rect = new $.rect($(dragged)).intersection($(e));
						console.debug(rect);
						if(intersects){
							$(dragged).animate(opos, 200);

							allowReposition = false;
							return false;
						}
					}
				});

				if(allowReposition){
					$(dragged).animate(pos, 200);
				}
			}
		});
	}
})
.directive("linkDirective", function(grid){
	return function(scope, ele, attrs){

		// var details = $(ele).find(".link-details");
		// $(ele).hover(function(){
		// 	details.removeClass('hide');
		// }, function(){
		// 	details.addClass('hide');
		// });

		$(ele).draggable({
			start : function(e, ui){
				$(this).data("originalPosition", ui.originalPosition);
				$(this).addClass("dragging");
			},
			stop : function(e, ui){
				$(this).removeClass("dragging");

				var pos;
				var opos = $(this).data("originalPosition");
				var dragged = $(this);
				if($(this).hasClass("folder")){
					pos = grid.findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = grid.findNearestPosForLink(ui.position.left, ui.position.top);
				}
				var allowReposition = true;
				$(".link, .folder").each(function(i, e){
					if(e != dragged[0]){
						area2 = {
							left : $(e).offset().left,
							top : $(e).offset().top,
							width : $(e).width(),
							height : $(e).height()
						}
						var bool = new $.rect($(dragged)).intersects($(e));
						if(bool){
							$(dragged).animate(opos, 200);

							allowReposition = false;
							return false;
						}
					}
				});

				if(allowReposition){
					$(dragged).animate(pos, 200);
				}
			}
		})
	}
});

