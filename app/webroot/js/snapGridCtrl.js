
app.controller("snapGridCtrl", ["$scope", function($scope){

	var hc = 30, hh = 30, hp = 10;
	var vc = 100, vw = 150, vp = 10;
	var hlines = [], vlines = [];

	(function(){
		for(var i = 0; i<hc; i++){
			hlines.push({
				y : i*(hh + hp)
			});
		}
		
		for(i = 0; i<vc; i++){
			vlines.push({
				x : i*(vw + vp)
			});
		}
		$scope.hlines = hlines;
		$scope.vlines = vlines;
	})();

	var findOverElementH = function(y){
		var t, tw;
		var hAreas = $(".hline");
		var ele;
		hAreas.each(function(i, e){
			t = $(e).offset().top;
			th = t + $(e).height() + hp;
			if(y >= t-2 && y <= th+2){
				ele = $(e);
			}
		});	
		return ele;
	}
	var findOverElementV = function(x){
		var l, lh;
		var vAreas = $(".vline");
		var ele;
		vAreas.each(function(i, e){
			l = $(e).offset().left;
			lw = l + $(e).width() + vp;
			if(x >= l-2 && x <= lw+2){
				ele = $(e);
			}
		});	
		return ele;
	}
	var findNearestPosForLink = function(x, y){

		var harea = findOverElementH(y);
		var varea = findOverElementV(x);
		if(y > (harea.offset().top + (harea.height()/2))){
			harea = harea.next();
		}
		if(x > (varea.offset().left + varea.width() * 0.7)){
			varea = varea.next();
		}
		var pos = [varea.offset().left, harea.offset().top];
		return pos;
	}
	var findNearestPosForFolder = function(x, y){
		var harea = findOverElementH(y);
		var varea = findOverElementV(x);
		var alignRight = false;
		if(y > (harea.offset().top + (harea.height()/2))){
			harea = harea.next();
		}
		if(x > (varea.offset().left + varea.width() * 0.6)){
			varea = varea.next();
			alignRight = true;
		}
		var pos = [varea.offset().left, harea.offset().top];
		if(alignRight){
			pos = [varea.offset().left - varea.width() / 2, harea.offset().top];
		}
		return pos;
	}
	var hoverX, hoverY;
	(function(){
		$(".link, .folder").draggable({

		});
		$("#desktop-view").droppable({
			drop :function(e, ui){
				var pos;
				if(ui.draggable.hasClass("folder")){
					pos = findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = findNearestPosForLink(ui.position.left, ui.position.top);
				}
				$(ui.draggable).animate({
					left : pos[0],
					top  : pos[1]
				}, 200);
			}
		});

	})();
}]);