var nn = nn || {};
var _n;
var _nnPlayers = [];
var _nnPlayerCount = 0;
var _nnIframeApiDeferred = $.Deferred();
var _nne = {};
var onYouTubePlayerReady = function(playerId){
	var nnPlayer, ytPlayer;
	for(i = 0; i<_nnPlayers.length; i++){
		if(_nnPlayers[i].id == playerId){
			
			(function(i, id){

			    var nnPlayer = _nnPlayers[i];
			    nnPlayer.$dom = $("#" + playerId);
			    nnPlayer.isReady = true;
				$(nnPlayer).trigger("onPlayerReady");

			    ytPlayer = document.getElementById(playerId);
			    if(ytPlayer){
				     ytPlayer.addEventListener("onStateChange", "onPlayerStateChange" + i);
				     ytPlayer.addEventListener("onError", "onPlayerError" + i);
			    }
			   
			    window["onPlayerStateChange" + i] = function (state) {
			    switch (state) {
				    case -1:
				        nnPlayer.state = "unstarted";
				        $(nnPlayer).trigger("unstarted");
				        break;
				    case 0:
				        nnPlayer.state = "ended";
				        $(nnPlayer).trigger("ended");
				        break;
				    case 1:
				        nnPlayer.state = "playing";
				        $(nnPlayer).trigger("playing");
				        break;
				    case 2:
				        nnPlayer.state = "paused";
				        $(nnPlayer).trigger("paused");
				        break;
				    case 3:
				        nnPlayer.state = "buffering";
				        $(nnPlayer).trigger("buffering");
				        break;
				    }
				    $(nnPlayer).trigger("stateChange", [state]);
				}

				window["onPlayerError" + i] = function (error) {
				    switch (error) {
				    case 2:
				        $(nnPlayer).trigger("invalidParameter", [error]);
				        break;
				    case 100:
				        $(nnPlayer).trigger("videoNotFound", [error]);
				        break;
				    case 101:
				    case 150:
				        $(_nnPlayers[i]).trigger("notAllowed", [error]);
				        break;
				    }
				    $(_nnPlayers[i]).trigger("error", [error]);
				}

			})(i, playerId);
		}
	}
}

var _nnYoutubeIframAPIIsReady = false;
var onYouTubeIframeAPIReady = function(){
	//console.log("iframe api ready");
	_nnYoutubeIframAPIIsReady = true;
	_nnIframeApiDeferred.resolve();
}

/******************************/
_n = nn;
/******************************/
_n.Player = function(id, html5, control){
	var self = this;
	var player;
	function onConstructed(){

		if(html5){
			createHTML5Player();
		}else{
			createFlashPlayer();
		}
	}

	function createHTML5Player(){
		var timeout;
		self.iframeApiReady().then(function(){
			player = new YT.Player(id, {
				height: '100%',
				width: '100%',
				autoplay : 0,
				playerVars : {
					fs : 0,
					showinfo : 0,
					rel : 0,
					autohide : 1
				},
				events: {
					onReady : function(){
						self.$dom = $("#" + id);
						self.isReady = true;
						$(_nne).trigger("onPlayerReady");
					},
					onStateChange : function(e){
						var state = e.data;
						switch(state){
							case -1:
								self.state = "unstarted";
								$(self).trigger("unstarted");
							break;
							case 0:
								self.state = "ended";
								$(self).trigger("ended");
							break;
							case 1:
								self.state = "playing";
								$(self).trigger("playing");
							break;
							case 2:
								self.state = "paused";
								$(self).trigger("paused");
							break;
							case 3:
								self.state = "buffering";
								$(self).trigger("buffering");
							break;
						}
						$(self).trigger("stateChange");
					},
					onError : function(e){
						var error = e.data;
						switch(error){
							case 2:
								$(self).trigger("invalidParameter", [error]);
							break;
							case 5:
								$(self).trigger("notHTML5Compatible", [error]);
							break;
							case 100:
								$(self).trigger("videoNotFound", [error]);
							break;
							case 101:
							case 150:
								$(self).trigger("notAllowed", [error]);
							break;
						}
						$(self).trigger("error", [error]);
					}
				}
	        });
		});

		_nnPlayers.push(self);
		_nnPlayerCount++;
	}

	function createFlashPlayer(){
		var wmode = "transparent",
		url = "http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=" + id,
		params = {
			allowScriptAccess: "always",
			wmode: wmode,
			disablekb: "0"
		},
		atts = {
			id: id
		};
		swfobject.embedSWF(url, id, "100%", "100%", "8", null, null, params, atts);
		_nnPlayers.push(self);
		_nnPlayerCount++;
	}

	this.ytPlayer = false;
	this.id = id;
	this.state = "constructed";
	this.playerType = html5 === true ? "iframe" : "flash";
	this.isReady = false;

	/* Custom functions */
	this.iframeApiReady = function(){
		if(_nnYoutubeIframAPIIsReady){
			_nnIframeApiDeferred.resolve();
		}
		return _nnIframeApiDeferred.promise();
	}
	// this.isReady = function(){
	// 	var rs = document.getElementById(id).hasOwnProperty("loadVideoById");
	// 	console.debug(rs);
	// 	return rs;
	// }
	this.ready = function(){
		var deferred = $.Deferred();
		if(self.isReady){
			if(self.playerType == "flash"){
				player = document.getElementById(id);
				_c.log(player);
			}
			deferred.resolve(self);
		}else{
			$(self).bind("onPlayerReady", function(){
				if(self.playerType == "flash"){
					player = document.getElementById(id);
					self.ytPlayer = player;
				}else{

				}
				deferred.resolve(self);
			});
		}
		return deferred.promise();
	}

	this.hide = function(){
		if(self.playerType === "flash"){
			$(player).css("left", "1000rem");
		}else{
			$("#" + id).css("left", "1000rem");
		}
	}
	this.show = function(){
		if(self.playerType === "flash"){
			$(player).css("left", "0");
		}else{
			$("#" + id).css("left", "0");
		}
	}

	/* YouTube native functions */


	/* Queueing functions */

	this.cueVideoById = function(videoId, startSeconds, suggestedQuality){
		player.cueVideoById(videoId, startSeconds, suggestedQuality);
	}
	this.loadVideoById = function(videoId, startSeconds, suggestedQuality){
		player.loadVideoById(videoId, startSeconds, suggestedQuality);
	}
	this.cueVideoByUrl = function(videoId, startSeconds, suggestedQuality){
		player.cueVideoByUrl(videoId, startSeconds, suggestedQuality);
	}
	this.loadVideoByUrl = function(videoId, startSeconds, suggestedQuality){
		player.loadVideoByUrl(videoId, startSeconds, suggestedQuality);
	}
	this.cuePlaylist = function(playlist, index, startSeconds, suggestedQuality){
		player.cuePlaylist(playlist, index, startSeconds, suggestedQuality);
	}
	this.loadPlaylist = function(playlist, index, startSeconds, suggestedQuality){
		player.loadPlaylist(playlist, index, startSeconds, suggestedQuality);
	}

	/* Playback controls and player settings */

	this.playVideo = function(){
		player.playVideo();
	}
	this.pauseVideo = function(){
		player.pauseVideo();
	}
	this.stopVideo = function(){
		player.stopVideo();
	}
	this.seekTo = function(seconds, allowSeekAhead){
		player.seekTo(seconds, allowSeekAhead);
	}
	this.clearVideo = function(){
		player.clearVideo();
	}
	this.nextVideo = function(){
		player.nextVideo();
	}
	this.previousVideo = function(){
		player.previousVideo();
	}
	this.playVideoAt = function(index){
		player.playVideoAt(index);
	}
	this.mute = function(){
		player.mute();
	}
	this.unMute = function(){
		player.unMute();
	}
	this.isMuted = function(){
		return player.isMuted();
	}
	this.setVolume = function(vol){
		player.setVolume(vol);
	}
	this.getVolume = function(){
		return player.getVolume();
	}
	this.getPlayerbackRate = function(){
		return player.getPlayerbackRate();
	}
	this.getPlayerbackRates = function(){
		return player.getPlayerbackRates();
	}
	this.getAvailablePlayerbackRate = function(){
		return player.getAvailablePlayerbackRate();
	}
	this.setLoop = function(loopPlaylists){
		player.setLoop(loopPlaylists);
	}
	this.setShuffle = function(shufflePlaylist){
		player.setShuffle(shufflePlaylist);
	}

	/* Playback status */

	this.getVideoLoadedFraction = function(){
		return player.getVideoLoadedFraction();
	}
	this.getPlayerState = function(){
		return player.getPlayerState();
	}
	this.getCurrentTime = function(){
		return player.getCurrentTime();
	}

	/* Playback status */

	this.getPlaybackQuality = function(){
		return player.getPlaybackQuality();
	}
	this.setPlaybackQuality = function(quality){
		player.setPlaybackQuality(quality);
	}
	this.getAvailableQualityLevels = function(){
		return player.getAvailableQualityLevels();
	}

	/* Retrieving video information */

	this.getDuration = function(){
		return player.getDuration();
	}
	this.getVideoUrl = function(){
		return player.getVideoUrl();
	}
	this.getVideoEmbedCode = function(){
		return player.getVideoEmbedCode();
	}

	/* Retrieving playlist information */

	this.getPlaylist = function(){
		return player.getPlaylist();
	}
	this.getPlaylistIndex = function(){
		return player.getPlaylistIndex();
	}
	this.addEventListener = function(evt, fn){
		document.getElementById(id).addEventListener(evt, fn);
	}

	onConstructed();

	/*
	Events

	onStateChange

    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued).

	onPlaybackQualityChange

    small
    medium
    large
    hd720
    hd1080
    highres
	
	onError


    2 – The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
    100 – The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
    101 – The owner of the requested video does not allow it to be played in embedded players.
    150 – This error is the same as 101. It's just a 101 error in disguise!

	*/
}
