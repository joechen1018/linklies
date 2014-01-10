
app.service("grid", function($timeout){
	var self = this;
	var $desk = $("#desktop-view");
	var hlines = [], vlines = [];

	this.findOverElementH = function(y){
		var t, tw;
		var ele;
		var hAreas = $(".hline");
		hAreas.each(function(i, e){
			t = $(e).offset().top;
			th = t + $(e).height() + hp;
			if(y >= t-2 && y <= th+2){
				ele = $(e);
			}
		});	
		if(y <= 20){
			ele = hAreas.eq(0);
		}
		return ele;
	}
	this.findOverElementV = function(x){
		var l, lh;
		var ele;
		var vAreas = $(".vline");
		vAreas.each(function(i, e){
			l = $(e).offset().left;
			lw = l + $(e).width() + vp;
			if(x >= l-2 && x <= lw+2){
				ele = $(e);
			}
		});	
		if(x <= 20){
			ele = vAreas.eq(0);
		}
		return ele;
	}
	this.findNearestPosForLink = function(x, y){

		var harea = self.findOverElementH(y);
		var varea = self.findOverElementV(x);
		if(y > (harea.offset().top + (harea.height()/2))){
			harea = harea.next();
		}
		if(x > (varea.offset().left + varea.width() * 0.7)){
			varea = varea.next();
		}
		var pos = {
			left : varea.offset().left, 
			top : harea.offset().top
		};
		return pos;
	}
	this.findNearestPosForFolder = function(x, y){

		var hAreas = $(".hline");
		var harea = self.findOverElementH(y);
		var varea = self.findOverElementV(x);
		var i = $(hAreas).index(harea);
		if(i%4 !== 0){
			i = Math.floor(i/4);
			harea = hAreas.eq(i*4);
		}
		// if(y > (harea.offset().top + (harea.height()/2))){
		// 	harea = harea.next();
		// }

		var pos = {
			left : varea.offset().left, 
			top : harea.offset().top
		}
		// if(alignRight){
		// 	pos = [varea.offset().left - varea.width() / 2, harea.offset().top];
		// }
		return pos;
	}
	this.getGridWidth = function(){
		var viewportWidth = $(window).width() - 30;
		var num = Math.floor(viewportWidth/160);
		var extra = viewportWidth - num*160;
		return Math.round(150 + (extra/num));
	}

	this.findFolderRect = function(pos){

	}
	var getFolderRects = function(){

	}
	var getLinksRects = function(){

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
		var h = self.getViewHeight();
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
		this.update();
		// this.folderRects = getFolderRects();
		// this.linkRects = getLinksRects();
	}
	this.update = function(){

		self.gridHeight = 30;
		self.gridMargin = 10;
		self.gridWidth = self.getGridWidth();	
		self.folderHeight = 4*self.gridHeight + 3*self.gridMargin;
		self.linkWidth = 2*self.gridWidth + self.gridMargin;

		$timeout(function(){
			self.hlines = self.getHLines();
			self.vlines = self.getVLines();
			
			$timeout(function(){
				var bodyHeight = $(window).height();
				var viewHeight = self.getViewHeight();

				self.viewHeight = viewHeight > bodyHeight ? viewHeight + 20 : viewHeight;
			}, 10);
		}, 10);
	}

	this.init();
	
})
.controller("desktopCtrl", function($scope, $timeout, grid){
	var links = [], folders = [];
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

	var timeout;
	$(window).resize(function(){
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			grid.update();
			$scope.$apply(function(){
				$scope.grid = grid;
			});
		}, 300);
	});

	//wait for folder directive construction
	$timeout(function(){
		$(".folder").draggable({
			start : function(){

			},
			drag : function(e, ui){
				
			},
			stop : function(e, ui){

				var folder = $(ui.helper.context);
				var folderBottom = ui.position.top + folder.height();

				if(folderBottom > grid.viewHeight){
					grid.update();
					$timeout(function(){
						$scope.$apply(function(){
							$scope.grid = grid;
						}, 100);
					});			
				}
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

