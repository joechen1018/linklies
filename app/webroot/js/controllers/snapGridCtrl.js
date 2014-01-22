
app.controller("snapGridCtrl", function($scope){


	return;
	var findOverElementH = function(y){
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
	var findOverElementV = function(x){
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
	var findNearestPosForLink = function(x, y){

		var harea = findOverElementH(y);
		var varea = findOverElementV(x);
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
	var findNearestPosForFolder = function(x, y){

		var hAreas = $(".hline");
		var harea = findOverElementH(y);
		var varea = findOverElementV(x);
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
});