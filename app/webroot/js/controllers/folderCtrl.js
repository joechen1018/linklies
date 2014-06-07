folderViewApp.controller("folderViewCtrl", function($scope, $timeout){
	//** variables
   var data, 
	_ = $scope, 
	$view = $("#links-container");

	data = app.data;

	$scope.index = 0;
	$scope.folder = data.Folder;
	$scope.links = data.Link;

	function updateUrl(){

		var $container = $("#links-container"),
			$links, $link, $iframe, $wrap, $noFrame, url;

		$links = $container.find(".link"), $link, $iframe;
   	for(var i = 0; i<$links.length; i++){
   		$link = $links.eq(i);
   		$iframe = $link.find("iframe").eq(0);
   		$wrap = $link.find(".iframe-wrap").eq(0);
   		$noFrame = $link.find(".no-iframe").eq(0);

   		if($scope.links[i].allowIframe){
   			$wrap.show();
   			$noFrame.hide();
			}else{
				$wrap.hide();
				$noFrame.show();

            setTimeout(function(){
               var $holder = $link.find(".img-holder").eq(0),
                   $img = $holder.find("img").eq(),
                   $h1 = $link.find("h1").eq(0),
                   $span = $h1.find("span").eq(0),
                   top = $span.offset().top + $h1.height();
               console.log($span.offset().top);    
               $img.css("top", top).show();
            }, 100);
            console.log($scope.links[i]);
			}
   		if($link.hasClass("current") || $link.hasClass("prev") || $link.hasClass("next")){
   			url = $scope.links[i].url;
   			if($iframe.attr("src") != url){
   				$iframe.attr("src", url);
   			}
   		}
   	}
	}

   var currentObj = {
		left : "15%",
		top : "0",
		width : "70%",
		height : "100%"
	},
	nextObj = {
		top : "5%",
		left : "90%",
		height : "90%",
		width : "90%"
	},
	prevObj = {
		top : "5%",
		left : "-80%",
		height : "90%",
		width : "90%"
	}, 
	outRight = {
		top : "10%",
		left : "165%",
		height : "80%",
		width : "80%"
	},
	outLeft = {
		top : "10%",
		left : "-1650%",
		height : "80%",
		width : "80%"
	};

	// $timeout(function(){
	// 	$current = $view.find(".link.current"),
	// 	$prev = $view.find(".link.prev"),
	// 	$next = $view.find(".link.next");

	// 	$current.css(currentObj);
	// 	$next.css(nextObj);
	// 	$prev.css(prevObj);
	// }, 100);

   	function addEvents(){
   		var addNavigateEvents = function(){
   			var index = 0, lastIndex = 0, watchModeTimer, mousemoveTimer;
   			var nextIndex = function(i, length){
   				i++;
   				if(i >= length){
   					i = 0;
   				}
   				console.log("next:" + i);
   				return i;
   			}
   			var prevIndex = function(i, length){
   				i--;
   				if(i === -1){
   					i = length - 1;
   				}
   				console.log("prev:" + i);
   				return i;
   			}
   			var animateFrames = function(){
   				var $container = $("#links-container"),
   					$links = $container.find(".link"),
					duration = 500,
   					length = $links.length;

   				$links.removeClass("current")
   					  .removeClass("next")
   					  .removeClass("prev");

   				$links.eq(index)
   					  .addClass("current")
   					  .css(currentObj);

   				$links.eq(nextIndex(index, length))
   					  .addClass("next")
   					  .css(nextObj);
   					  
   				$links.eq(prevIndex(index, length))
   					  .addClass("prev")
   					  .css(prevObj);	  	  

   				updateUrl();	  
               $(".link.current").stop().fadeTo(0, 1);
               setTimeout(function(){
                  setMouseMove();
               }, 100);
   			}
            var setWatchModeTimer = function(){
               clearTimeout(watchModeTimer);
               watchModeTimer = setTimeout(function(){
                  $(".link.next, .link.prev").stop().fadeTo(500, 0.2);
               }, 2000);
            }

            var setMouseMove = function(){

               return;

               var $current = $(".link.current");
               var $currentHover = $current.find(".hover-overlay");

               $currentHover.unbind("mousemove");
               $currentHover.mousemove(function(){
                  console.log("move");
                  clearTimeout(mousemoveTimer);
                  mousemoveTimer = setTimeout(function(){
                     $currentHover.hide();
                     $current.find(".options").stop().fadeTo(10, 0.1);
                  }, 500);
                  $current.find(".options").stop().fadeTo(10, 1); 
               });
               $current.find(".options").stop().fadeTo(10, 1); 
            }
   			$view.on("click", ".link.next", function(){
   				lastIndex = index;
   				index = nextIndex(index, _.links.length);
   				animateFrames();
               setWatchModeTimer();
   			});

   			$view.on("click", ".link.prev", function(){
   				lastIndex = index;
   				index = prevIndex(index, _.links.length);
   				animateFrames();
   			});

            $view.on("mouseenter", ".link.next, .link.prev", function(){
               $(".next, .prev").stop().fadeTo(10, 1);
            });
            $view.on("mouseout", ".link.next, .link.prev", function(){
               setWatchModeTimer();
               // clearTimeout(mousemoveTimer);
               // mousemoveTimer = setTimeout(function(){
                  
               // }, 10);
            });

            setMouseMove();
            setWatchModeTimer();
   		}
   		addNavigateEvents();
   	}
   	addEvents();

   	$timeout(function(){
   		updateUrl();
   	}, 100);
});