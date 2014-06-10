folderViewApp.controller("folderViewCtrl", function($scope, $timeout, keyboardManager, gapiService) {
    //** variables
    var data,
        $view = $("#links-container"),
        cookieUser = $.cookie("user"),
        localUser = localStorage.getItem("userData"),
        user = app.data.User,
        parseLinkType = function(links){
          for(var i = 0; i<links.length; i++){
              links[i].type = JSON.parse(links[i].type);
          }
          return links;
        };

    data = app.data;
    $scope.index = 0;
    $scope.folder = data.Folder;
    $scope.links = parseLinkType(data.Link);
    $scope.showPaginator = false;
    $scope.showNavLeft = false;
    $scope.showNavRight = false;
    $scope.imageUrl = "";
    $scope.getImagePos = function(index){
        if(index === $scope.index){
            var left = top = 0, width, height, 
                pageWidth = $(window).width() * 0.7,
                $img = $view.find(".link").eq(index).find(".img-view img");

                console.log($img.width());

            if($img.width() > pageWidth){
                width = pageWidth;
            }else{
                left = (pageWidth - $img.width()) / 2;
                top = ($(window).height() - $img.height()) / 2;
            }
            return {
                left : left,
                top : top,
                width : width,
                height : height
            }
        }
    }

    gapiService.initFolderView();

    //** update content everytime after page changes
    function updateUrl() {
        var $container = $("#links-container"),
            $links = $container.find(".link"),
            $link,
            $iframe,
            $wrap,
            $noFrame,
            url, 
            link, links = $scope.links;

        for (var i = 0; i < $links.length; i++) {
            $link = $links.eq(i);
            $iframe = $link.find("iframe").eq(0);
            $noFrame = $link.find(".no-iframe").eq(0);
            link = $scope.links[i];

            // setTimeout(function() {
            //       var $holder = $link.find(".img-holder").eq(0),
            //       $img = $holder.find("img").eq(),
            //       $h1 = $link.find("h1").eq(0),
            //       $span = $h1.find("span").eq(0),
            //       top = $span.offset().top + $h1.height();
            //       $img.css("top", top).show();
            //     }, 100);
            // }

            if(link.type.isImage && !link.type.isGoogleImage){
                links[i].imageUrl = link.url;
            }

            if ($link.hasClass("current") || $link.hasClass("prev") || $link.hasClass("next")) {

                //** update iframe url if not already
                url = $scope.links[i].url;
                if(link.allowIframe){
                    if ($iframe.attr("src") != url) {
                        $iframe.attr("src", url);
                    }
                }

                if(link.type.isImage){
                  if(link.type.isGoogleImage){
                      (function(link){
                          setTimeout(function(){
                          gapiService.check().then(function(rs){
                              console.log(rs);
                              gapiService.ready().then(function(){
                                  gapiService.loadDrive().then(function(){
                                      console.log(link);
                                      console.log(link.key);
                                      gapiService.getDriveFile(link.key).then(function(file){
                                          console.log(file);
                                      });
                                  });
                              });
                          });
                        }, 1000);
                      })(link);

                  }else{
                        //if($link.hasClass("current")){
                        if(true){    
                            (function($img){
                                    var pageWidth = $(window).width() * 0.7, style = {};
                                    var setStyle = function(){
                                        // if($img.width() > pageWidth ||
                                        //    $img.height() > $(window).height()){
                                        if(false){

                                            if($img.width() > $img.height()){
                                                style.height = $(window).height();
                                                style.left = ($img.width() - pageWidth) / 2;
                                            }
                                        }else{
                                            style.left = (pageWidth - $img.width()) / 2;
                                            style.top = ($(window).height() - $img.height()) / 2;
                                        }
                                        // console.log(style);
                                        $img.css(style);
                                    }
                                    if($img.width() === 0){
                                        $img.load(function(){
                                             setStyle();
                                        });
                                    }else{
                                        setStyle();
                                    }

                            })($link.find(".img-view img"));
                            
                        }
                  }
                }
            }
        }

        $scope.$apply(function(){
            $scope.links = links;
        });
    }

    var currentObj={left:"15%",top:"0",width:"70%",height:"100%"},nextObj={top:"5%",left:"90%",height:"90%",width:"90%"},prevObj={top:"5%",left:"-80%",height:"90%",width:"90%"},outRight={top:"10%",left:"165%",height:"80%",width:"80%"},outLeft={top:"10%",left:"-1650%",height:"80%",width:"80%"}

    function addEvents() {
        var addNavigateEvents = function() {
            var index = 0,
            lastIndex = 0,
            watchModeTimer,
            mousemoveTimer,
            showPaginatorTimer;

            var nextIndex = function(i, length) {
                i++;
                if (i >= length) {
                    i = 0;
                }
                return i;
            }
            var prevIndex = function(i, length) {
                i--;
                if (i === -1) {
                    i = length - 1;
                }
                return i;
            }
            var animateFrames = function(dir) {
                var $container = $("#links-container"),
                $links = $container.find(".link"),
                duration = 500,
                length = $links.length;

                //* remove all classes    
                $links.removeClass("current next prev");

                //* current index
                $links.eq(index).addClass("current").css(currentObj);

                if (length > 2) {
                    $links.eq(nextIndex(index, length)).addClass("next").css(nextObj);

                    $links.eq(prevIndex(index, length)).addClass("prev").css(prevObj);
                } else {
                    if (dir === 1) {
                        $links.eq(prevIndex(index, length)).addClass("prev").css(prevObj);
                    } else if (dir === -1) {
                        $links.eq(nextIndex(index, length)).addClass("next").css(nextObj);
                    }
                }

                updateUrl();
                $(".link.current").stop().fadeTo(0, 1);

                $scope.$apply(function() {
                    //* update index
                    $scope.index = index;
                    //* show paginator 
                    $scope.showPaginator = true;
                });

                //* hide after 2 secs
                clearTimeout(showPaginatorTimer);
                showPaginatorTimer = setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.showPaginator = false;
                    });
                }, 3000);
            }
            var setWatchModeTimer = function() {
                clearTimeout(watchModeTimer);
                watchModeTimer = setTimeout(function() {
                    $(".link.next, .link.prev").stop().fadeTo(500, 0.2);
                }, 3000);
            }

            //*** click or keyboard to go next
            $view.on("click", ".link.next", function() {
                lastIndex = index;
                index = nextIndex(index, $scope.links.length);
                animateFrames(1);
                setWatchModeTimer();
            });

            keyboardManager.bind("right", function() {
                lastIndex = index;
                index = nextIndex(index, $scope.links.length);
                animateFrames(1);
                setWatchModeTimer();
            });

            //*** click or keyboard to go prev
            $view.on("click", ".link.prev", function() {
                lastIndex = index;
                index = prevIndex(index, $scope.links.length);
                animateFrames( - 1);
                setWatchModeTimer();
            });

            keyboardManager.bind("left", function() {
                lastIndex = index;
                index = prevIndex(index, $scope.links.length);
                animateFrames( - 1);
                setWatchModeTimer();
            });

            $view.on("mouseenter", ".link.next, .link.prev", function() {
                $(".next, .prev").stop().fadeTo(10, 1);
                if ($(this).hasClass('next')) {
                    $scope.$apply(function() {
                        $scope.showNavRight = true;
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.showNavLeft = true;
                    });
                }
            });
            $view.on("mouseout", ".link.next, .link.prev", function() {
                setWatchModeTimer();
                $scope.$apply(function() {
                    $scope.showNavLeft = false;
                    $scope.showNavRight = false;
                });
                // clearTimeout(mousemoveTimer);
                // mousemoveTimer = setTimeout(function(){
                // }, 10);
                });

            setWatchModeTimer();
        }
        addNavigateEvents();
    }
    //** handel events
    addEvents();

    //** show page title once first
    showPaginatorTimer = setTimeout(function() {
        $scope.$apply(function() {
            $scope.showPaginator = false;
        });
    }, 3000);
    $timeout(function() {
        $scope.showPaginator = true;
        updateUrl();
    }, 100);
});