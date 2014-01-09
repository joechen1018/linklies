
app.controller("desktopCtrl", function($scope){
	var links = [], folders = [];
	var margin = 20;
	var gridWidth = 150;

	var drawLines = function(){
		console.debug("resize");
		var getGridWidth = function(){
			var viewportWidth = $(window).width() - 30;
			var num = Math.floor(viewportWidth/160);
			var extra = viewportWidth - num*160;
			return Math.round(150 + (extra/num));
		}
		gridWidth = getGridWidth();

		var hc = gridWidth, hh = 30, hp = 10;
		var vc = 100, vw = gridWidth, vp = 10;
		var hlines = [], vlines = [];
		var desk = $("#desktop-view");

		hlines = [], vlines = [], links = [], folders = [];
		for(var i = 0; i<hc; i++){
			hlines.push({
				y : 20 + i*(hh + hp)
			});
		}
		
		for(i = 0; i<vc; i++){
			vlines.push({
				x : 20 + i*(vw + vp),
				width : gridWidth
			});
		}

		for(var i = 0; i<6; i++){
			links.push({
				id : "link-" + (i+1),
				left : 20,
				top : 180 + (i*40),
				grid : [0, 4+i],
				width : gridWidth*2 + 10,
				pageTitle : "Nina Simone - Feeling good (Nicolas Jaar edit) \"Nico's feeling Good\" - YouTube",
				thumb : "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQBdfgUT1fJTToGl&w=398&h=208&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FBkzvSf9NLTY%2Fhqdefault.jpg&cfs=1&upscale",
				contentTitle : "Nicolas Jaar - Sonar 2012 (full set)",
				from : "www.youtube.com",
				desc : "Why sin? Because of ignorence. Why Ignorence? Because we block ourselves. Why block ourselves? Because it is painful to be ourselves. Why it is painful to be ourselves? Because we have sin and we're ignorent."
			});

			folders.push({
				id : "folder-" + (i+1),
				type : i % 2 === 0 ? "" : "youtube",
				left : 20 + i * (gridWidth + 10),
				width : gridWidth,
				top : 20,
				name : "test folder",
				grid : [i, 0],
				state : ""
			});
		}
		$scope.$apply(function(){
			$scope.hlines = hlines;
			$scope.vlines = vlines;
			$scope.links = links;
			$scope.folders = folders;
		});
	};
	$(window).resize(drawLines);
	drawLines();
})
.service("gridAlignmentService", function(){
	var hc = 100, hh = 30, hp = 10;
	var vc = 100, vw = 150, vp = 10;
	var hlines = [], vlines = [];
	var desk = $("#desktop-view");
	var self = this;
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
})
.directive("folderDirective", function(gridAlignmentService){
	return function(scope, ele, attrs){

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
					pos = gridAlignmentService.findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = gridAlignmentService.findNearestPosForLink(ui.position.left, ui.position.top);
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
.directive("linkDirective", function(gridAlignmentService){
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
					pos = gridAlignmentService.findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = gridAlignmentService.findNearestPosForLink(ui.position.left, ui.position.top);
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

