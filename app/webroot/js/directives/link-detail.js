app.directive('linkDetail', function(apiService, $rootScope, apiParser, $timeout){
	return {
		link : function(scope, ele, attrs){
			var data = scope.data,
				linkService = apiService.linkService,
				$playerHolder, 
				$detailWrap,
				$img,
				$ele = $(ele),
				$player;

			scope.playVideo = function(){

				var type = data.type;

				//** hide displayed image
				$detailWrap = $ele.find(".type-wrap").eq(0);
				$detailWrap.trigger("videoStart");

				$img = $detailWrap.find(".img").find("img").eq(0);
				$img.hide();

				//** embed iframe player
				var src = utils.replace(type.embedUrl, {
					"VIDEO_ID" : type.videoId
				});


				$player = $ele.find(".player-holder iframe").eq(0);
				$player.show();
				$player.attr("src", src);

				//** player size equal to the image size
				$playerHolder = $ele.find(".player-holder");
				$playerHolder.css('top', $img.position().top)
							 .css('width', $img.width())
							 .css('height', $img.height());
			}

			scope.stopVideo = function(){

			}

			scope.slideThumb = function(dir){
				data.thumbIndex += dir;
				if(data.thumbIndex < 0) data.thumbIndex = 0;
				if(data.thumbIndex >= data.images.length) data.thumbIndex = data.images.length - 1;
				var $holder = $ele.find(".img .holder");
				var $img = $holder.find("img").eq(data.thumbIndex);
				var $wrap = $ele.find(".detail-wrap");

				$wrap.addClass("animating");
				$("div.img").css("background", "none");

				$holder.height($img.height());
				$holder.animate({
					left : -(data.thumbIndex * 330)
				}, 300, function(){
					$wrap.removeClass("animating");
					$("div.img").css("background", "white");
					apiService.linkService.save(data);
				});
			}

			$timeout(function(){
				$detailWrap = $ele.find(".type-wrap").eq(0);
				$detailWrap.on("stopVideo", scope.stopVideo);
			}, 100);
		}
	}
});