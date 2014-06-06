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
   			var index = 0, lastIndex = 0;
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
   			}

   			$view.on("click", ".link.next", function(){
   				lastIndex = index;
   				index = nextIndex(index, _.links.length);
   				animateFrames();
   			});

   			$view.on("click", ".link.prev", function(){
   				lastIndex = index;
   				index = prevIndex(index, _.links.length);
   				animateFrames();
   			});
   		}
   		addNavigateEvents();
   	}
   	addEvents();
   	$timeout(function(){
   		updateUrl();
   	}, 100);

});