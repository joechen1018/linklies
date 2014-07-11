//deprecated
app.controller("folderViewCtrl", function($scope, $timeout, keyboardManager, gapiService) {
    //** variables
    var data,
        $view = $("#links-container"),
        cookieUser = $.cookie("user"),
        localUser = localStorage.getItem("userData"),
        user = appData.User,
        parseLinkType = function(links){
          for(var i = 0; i<links.length; i++){
              links[i].type = JSON.parse(links[i].type);
          }
          return links;
        };

    data = appData;
    $scope.index = 0;
    $scope.folder = data.Folder;
    $scope.links = parseLinkType(data.Link);
    $scope.showPaginator = false;
    $scope.showNavLeft = false;
    $scope.showNavRight = false;
    $scope.imageUrl = "";

    $scope.refreshIframe = function(){
        var $iframe = $(".link.current .iframe-wrap>iframe");
        var src = $iframe.attr("src");
        $iframe.attr("src", "");
        $iframe.attr("src", src);
    }

    $scope.goFullScreen = function(){
        var $link = $(".link.current");
        $link.animate({
            left : 0,
            top : 0,
            width : '100%',
            height : '100%'
        }, 300, function(){
            
        });
        $link.find(".options").addClass("fullscreen");

        var $img = $link.find(".img-view img");
        var style = {
            left : ($(window).width() - $img.width()) / 2,
            top : ($(window).height() - $img.height()) / 2
        }
        $img.animate(style, 300, function(){
        });
    }

    $scope.goBackFullScreen = function(){
        var $link = $(".link.current");
        $link.animate(currentObj, 300);
        $link.find(".options").removeClass("fullscreen");

        var $img = $link.find(".img-view img");
        var style = {
            left : ($(window).width()*0.7 - $img.width()) / 2,
            top : ($(window).height() - $img.height()) / 2
        }
        $img.animate(style, 300, function(){
            // $(window).resize();
        });
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

            if ($link.hasClass("current") || $link.hasClass("next")) {

                //** update iframe url if not already
                url = $scope.links[i].url;
                if(link.allowIframe){
                    if ($iframe.attr("src") != url) {
                        $iframe.attr("src", url);
                    }
                }
                //** handle videos
                if($link.hasClass("video")){
                    var src = link.type.embedUrl.replace("{{VIDEO_ID}}",  link.type.videoId)
                    .replace("autoplay=1", ""),
                        $player = $link.find(".video-view").find("iframe").eq(0);

                    if($player.attr('src') !== src){
                        $player.attr("src", src);
                    }
                }

                //** handle images
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
                            (function($img, $wrap){
                                    var getStyle = function(w, h){
                                        var $link = $(".link.current");
                                        var pageWidth = $(window).width() * 0.7, style = {};
                                        if($link.find(".options").hasClass("fullscreen")){
                                            style.left = ($(window).width() - w) / 2;
                                            style.top = ($(window).height() - h) / 2;
                                            style.width = w;
                                            style.height = h;
                                        }else{
                                            style.left = (pageWidth - w) / 2;
                                            style.top = ($(window).height() - h) / 2;
                                            style.width = w;
                                            style.height = h;
                                        }
                                        return style;
                                    }
                                    var setStyle = function(){
                                        // if($img.width() > pageWidth ||
                                        //    $img.height() > $(window).height()){
                                        
                                        var style = getStyle($img.width(), $img.height());
                                        // console.log(style);
                                        $img.css(style);
                                    }
                                    var bindMouseWheel = function(){
                                        var min = 0.3, scale = 1, w = $img.width(), h = $img.height();
                                        $wrap.bind("mousewheel", function(e){
                                            if($wrap.attr("data-scale")){
                                                scale = $wrap.attr("data-scale");
                                            }

                                            if(e.deltaY > 0){
                                                scale *= 1.2;
                                            }else{
                                                scale *= 0.8;
                                            }

                                            if($wrap.find("img:animated").length === 0 && scale >= min){
                                                var style = getStyle(
                                                    w * scale, 
                                                    h * scale
                                                );
                                                $img.stop().animate(style, 200);
                                                $wrap.attr("data-scale", scale);
                                            }
                                        });
                                    }

                                    if($img.width() === 0){
                                        $img.load(function(){
                                             setStyle();
                                             bindMouseWheel();
                                        });
                                    }else{
                                        setStyle();
                                        bindMouseWheel();
                                    }

                                    $(window).bind("resize", setStyle);

                            })($link.find(".img-view img"), $link.find(".img-view"));
                            
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
                $options = $("ul.options"),
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
                    $scope.showOptions = true;
                    $options.removeClass("dim");
                });

                //* hide after 2 secs
                clearTimeout(showPaginatorTimer);
                showPaginatorTimer = setTimeout(function() {
                    $scope.$apply(function() {
                        $scope.showPaginator = false;
                        $scope.showOptions = false;
                        $options.addClass("dim");
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
            $scope.showOptions = false;
            $("ul.options").addClass("dim");
        });
    }, 3000);
    $timeout(function() {
        $scope.showOptions = true;
        $scope.showPaginator = true;
        updateUrl();
    }, 100);

    //** remove dim when hover
    $("body").on("mouseenter", "ul.options", function(e){
        var $options = $(e.currentTarget);
        $options.removeClass("dim");
        if($options.parent().parent().hasClass("current")){
            $scope.$apply(function(){
                $scope.showPaginator = true;
            });
        }
    });
    $("body").on("mouseleave", "ul.options", function(e){
        var $options = $(e.currentTarget);
        $options.addClass("dim");
        if($options.parent().parent().hasClass("current")){
            $scope.$apply(function(){
                $scope.showPaginator = false;
            });
        }
    });

    // $(window).bind("beforeunload",function(event){
    //     return "Are you sure leaving this page?";
    // });
});

//new
app.controller("folderViewCtrl1", function($scope, $timeout){

    var $container = $(".folder-view-container"),
        $list = $container.find("li.link"),
        $thumbs,
        cookieUser = $.cookie("user"),
        localUser = localStorage.getItem("userData"),
        user = appData.User, 
        links = appData.Link,
        folder = appData.Folder;

    for(var i = 0; i<links.length; i++){

        if(typeof links[i].images === "string"){
            links[i].images = links[i].images.split(",");
            links[i].meta = JSON.parse(links[i].meta);
            if(links[i].description === ""){
                links[i].description = links[i].meta['og:description'] || links[i].meta['description'];
                // console.log(links[i].description);
            }
        }
    }    

    function reposition(animate){

        var w = $container.width(),
            w1 = 300,
            ps = [],
            cols, m, p;

        if(animate === undefined) animate = false;

        cols = Math.floor(w/w1);
        m = Math.floor((w - cols*w1)/(cols-1));
        if(m < 15){
            m = 15;
        }else if(m > 30){
            m = 30;
        }
        w1 = (w - m*(cols-1)) / cols;

        //** init size and pos
        $list.width(w1);
        $list.find("img.thumb").width(w1);

        $scope.$apply(function(){
            $scope.cardWidth = w1;
        });

        ps = [];
        $list.each(function(i, e){
            ps.push({
                height : $(e).height()
            });
        });

        $list.each(function(i, e){
            var p;
            if(i<cols){
                ps[i].top = 0;
                ps[i].left = i*(w1+m);
            }else{
                p = ps[i-cols];
                ps[i].top = p.top + p.height + m
                ps[i].left = p.left;
            }
        });

        $list.each(function(i, e){
            if(animate){
                $(e).animate({
                    left : ps[i].left,
                    top : ps[i].top
                }, 500);
            }else{
                $(e).css({
                    left : ps[i].left,
                    top : ps[i].top
                }).show();
            }
        });
    }

    function init(){

        $container = $(".folder-view-container");
        $list = $container.find("li.link");
        $thumbs = $(".list img.thumb");

        reposition();
        $list.draggable({
            start : function(e, ui){
                var $link = $(ui.helper[0]);
                $link.css({
                    "z-index" : 1000
                });
            },
            stop : function(e, ui){
                var $link = $(ui.helper[0]);
                $link.css({
                    "z-index" : 1
                });
                reposition(true);
            }
        });
    }

    $scope.folder = folder;
    $scope.links = links;
    $scope.cardWidth = 300;
    $scope.playVideo = function(){

    }
    $scope.slideThumb = function(dir){

    }

    $timeout(init, 1000);

    var timeout;    
    $(window).resize(function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            reposition(true);
        }, 500)
    });
});