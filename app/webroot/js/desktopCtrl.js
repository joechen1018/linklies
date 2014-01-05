
app.controller("desktopCtrl", function($scope){
	var links = [];
	for(var i = 0; i<6; i++){
		links.push({
			id : "link-" + (i+1),
			left : 20,
			top : 180 + (i*40),
			pageTitle : "Nina Simone - Feeling good (Nicolas Jaar edit) \"Nico's feeling Good\" - YouTube",
			thumb : "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQBdfgUT1fJTToGl&w=398&h=208&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FBkzvSf9NLTY%2Fhqdefault.jpg&cfs=1&upscale",
			contentTitle : "Nicolas Jaar - Sonar 2012 (full set)",
			from : "www.youtube.com",
			desc : "Why sin? Because of ignorence. Why Ignorence? Because we block ourselves. Why block ourselves? Because it is painful to be ourselves. Why it is painful to be ourselves? Because we have sin and we're ignorent."
		});
	}
	$scope.links = links;

	$(".folder").each(function(i,e){
		$(e).css("left", 20 + i*160).
		css("top", 20);
	});

	(function(){

		$(".link, .folder").draggable({
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
					pos = findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = findNearestPosForLink(ui.position.left, ui.position.top);
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
		});

	})();
}).
directive("linkDirective", function(){
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
					pos = findNearestPosForFolder(ui.position.left, ui.position.top);
				}else{
					pos = findNearestPosForLink(ui.position.left, ui.position.top);
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

