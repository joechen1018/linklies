folderViewApp.controller("folderViewCtrl", function($scope, $timeout, keyboardManager) {
    //** variables
    var data,
        _ = $scope,
        $view = $("#links-container"),
        parseLinkType = function(links){
          for(var i = 0; i<links.length; i++){
              links[i].type = JSON.parse(links[i].type);
              // console.log(links[i].type);
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


    function updateUrl() {

        var $container = $("#links-container"),
        $links,
        $link,
        $iframe,
        $wrap,
        $noFrame,
        url;

        $links = $container.find(".link"),
        $link,
        $iframe;
        for (var i = 0; i < $links.length; i++) {
            $link = $links.eq(i);
            $iframe = $link.find("iframe").eq(0);
            $wrap = $link.find(".iframe-wrap").eq(0);
            $noFrame = $link.find(".no-iframe").eq(0);

            if ($scope.links[i].allowIframe) {
                $wrap.show();
                $noFrame.hide();
            } else {
                $wrap.hide();
                $noFrame.show();

                setTimeout(function() {
                    var $holder = $link.find(".img-holder").eq(0),
                    $img = $holder.find("img").eq(),
                    $h1 = $link.find("h1").eq(0),
                    $span = $h1.find("span").eq(0),
                    top = $span.offset().top + $h1.height();
                    $img.css("top", top).show();
                }, 100);
            }
            if ($link.hasClass("current") || $link.hasClass("prev") || $link.hasClass("next")) {
                url = $scope.links[i].url;
                if ($iframe.attr("src") != url) {
                    $iframe.attr("src", url);
                }
            }
        }
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
                }, 2000);
            }

            //*** click or keyboard to go next
            $view.on("click", ".link.next", function() {
                lastIndex = index;
                index = nextIndex(index, _.links.length);
                animateFrames(1);
                setWatchModeTimer();
            });

            keyboardManager.bind("right", function() {
                lastIndex = index;
                index = nextIndex(index, _.links.length);
                animateFrames(1);
                setWatchModeTimer();
            });

            //*** click or keyboard to go prev
            $view.on("click", ".link.prev", function() {
                lastIndex = index;
                index = prevIndex(index, _.links.length);
                animateFrames( - 1);
                setWatchModeTimer();
            });

            keyboardManager.bind("left", function() {
                lastIndex = index;
                index = prevIndex(index, _.links.length);
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
    addEvents();

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