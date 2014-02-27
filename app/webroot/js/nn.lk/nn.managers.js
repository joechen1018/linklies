var nn = nn || {};
nn.managers = nn.managers || {};

/******************************/
_n = nn.managers;
/******************************/


/*
* ** 3 way proloading use case :
* 
* var players = new PreloadManager(player1, player2, player3, player4); // 4 players in this case, but can give it any number of players
* players.loadVideo("video1"); // load up current video and add "current" tag
* players.preloadVideos("nextSubepisode", "nextChannel", "prevChannel"); // w_n "nextSubepisode" is youtube video id, also used as player temporary id
* 
* ** user flip right - next sub-episode or next episode
* 
* players.discardVideo("video1"); //free current player
* var player = players.findPreloadedPlayer("nextSubEpisodeVideo"); // this will add "current" tag to the returned player
* player.ready().then(function(){ 
* 	player.playVideo();	
* });
* players.preloadVideo("video2"); //preload next sub-episode
* 
* ** user flip up - next channel first video
* (do not discard current player because current player will be hold as prev channel)
* 
* player.seekTo(0);
* player.pauseVideo();
* players.discardCurrent(); // un-mark all "current" tags
* 
* players.discardVideo("prevChannelFirstVideo");// discard preloaded prev channel
* 
* player = findPreloadedPlayer("nextChannelFirstVideo");
* player.playVideo();	
* 
* players.preloadVideo("video3");//preload next channel
* 
*/
_n.PreloadManager = function(){
	this.players = arguments;
	var self = this;
	var currentPlayer;
	var getAvailablePlayer = function(){
		var players = self.players, player;
		for(var i = 0; i<players.length; i++){
			player = players[i];
			if(player.videoId === undefined){
				return player;
			}
		}
		for(i = players.length - 1; i>-1; i--){
			player = players[i];
			if(player.current === undefined || player.current === false){
				player.videoId = undefined;
				return player;
			}
		}
		player.videoId = undefined;
		return player;
	}
	var unMarkCurrents = function(){
		var players = self.players;
		for(var j = 0; j<players.length; j++){
			players[j].current = false;
			if(players[j].$dom !== undefined){
				players[j].$dom.removeClass("current");
			}
		}
	}
	var allReadyDeferred = $.Deferred();
	var allReady = false;
	//use this function to load first video that is not preloaded
	this.loadVideo = function(vid){
		var player = getAvailablePlayer();
		player.videoId = vid;
		player.ready().then(function(player){
			unMarkCurrents();
			player.current = true;
			currentPlayer = player;
			player.loadVideoById(vid);
			player.$dom.addClass("current");
			player.show();
		});
		return player;
	}
	this.cueVideo = function(vid){
		var player = getAvailablePlayer();
		player.videoId = vid;
		player.ready().then(function(player){
			unMarkCurrents();
			player.current = true;
			currentPlayer = player;
			player.cueVideoById(vid);
			player.$dom.addClass("current");
			player.show();
		});
		return player;
	}
	this.ready = function(){
		var intv;
		var detect = function(){
			var evt = {};
			clearInterval(intv);
			intv = setInterval(function(){
				var count = 0;
				for(var i = 0; i<self.players.length; i++){
					if(self.players[i].isReady){
						count++;
					}
				}
				if(count === self.players.length){
					clearInterval(intv);
					$(evt).trigger("allReady");
				}
			}, 500);
			return evt;
		}
		if(allReady){
			return allReadyDeferred.resolve();
		}else{
			var e = detect();
			$(e).one("allReady", function(){
				allReadyDeferred.resolve();	
			});
		}
		return allReadyDeferred.promise();
	}
	this.preloadVideos = function(){
		for(var i = 0; i<arguments.length; i++){
			self.preloadVideo(arguments[i]);
		}
	}
	this.preloadVideo = function(vid){
		if(this.players.length <= 1) return;
		var player = getAvailablePlayer();
		player.ready().then(function(){
			player.loadVideoById(vid);
			player.videoId = vid;
			player.pauseVideo();
			player.current = false;
		});
		return player;
	}
	this.discardVideo = function(vid){
		var players = self.players, player;
		for(var i = 0; i<players.length; i++){
			player = players[i];
			if(player.videoId !== undefined){
				if(players[i].videoId === vid){
					player.videoId = undefined;
					player.current = false;
					player.$dom.removeClass("current");
					player.hide();
					return player;
				}
			}
		}
		return false;
	}
	this.discardCurrent = function(){
		var players = self.players, player;
		for(var i = 0; i<players.length; i++){
			player = players[i];
			if(player.current){
				player.videoId = undefined;
				player.hide();
				unMarkCurrents();
				return player;
			}
		}
		return false;
	}
	this.findPreloadedPlayer = function(vid){
		var players = self.players, player;
		for(var i = 0; i<players.length; i++){
			player = players[i];
			if(player.videoId !== undefined && player.videoId === vid){
				unMarkCurrents();
				player.current = true;
				currentPlayer = player;
				player.$dom.addClass("current");
				return player;
			}
		}
		return false;
	}
	this.currentPlayer = function(){
		if(currentPlayer !== undefined){
			return currentPlayer;
		}
		return false;
	}
};


_n.EpisodeManager = function(preloadManager, $titlecardLayer, cueVideo){
	cueVideo = cueVideo === undefined ? false : true;
	var lineup;
	var lineupItem;
	var manager = preloadManager;
	var player;
	var timer, interval;
	var isPlaying = false;
	var vid, nextVid, startSeconds, endSeconds, duration;
	var self = this;
	
	var playProgram = function(program){
		var initUpdateTime = function(){
			clearInterval(interval);
			interval = setInterval(function(){
				self.programSecond = player.getCurrentTime();
				self.currentSecond = self.position + self.programSecond;
			}, 1000);
		}

		vid = program.content.videoId;
		startSeconds = program.content.startSeconds;
		endSeconds = program.content.endSeconds;
		duration = program.content.duration;

		self.position = self.currentSecond = program.position;

		//get player
		$(player).unbind();
		player = manager.findPreloadedPlayer(vid);
		if(player === false){
			if(cueVideo){
				player = manager.cueVideo(vid);
			}else{
				player = manager.loadVideo(vid);
				player.show();
			}
		}else{

			player.playVideo();
			player.show();

			//if play video directly the player won't fire "playing" event, so we need to also do the seekTo _n
			if(startSeconds > 0){
				player.seekTo(startSeconds, true);
				initUpdateTime();
			}
		}

		//init timer
		clearTimeout(timer);
		timer = setTimeout(function(){
			var state = player.state;
			if(state === "playing"){
				player.pauseVideo();
				$(player).trigger("ended");
			}
		}, (duration+3)*1000);


		if(player !== false){
			//add events
			$(player).bind("buffering", function(){
				$(self).trigger("buffering");
			});
			$(player).bind("playing", function(){
				isPlaying = true;
				if(startSeconds > 0){
					player.seekTo(startSeconds, true);
				}
				initUpdateTime();
				$(self).trigger("playing");
			});
			$(player).bind("paused", function(){
				$(self).trigger("paused");
			});

			$(player).bind("ended", function(){
				onItemEnd(program);
			});

			$(player).bind("error", function(){

			});
		}
	}
	var playTitleCard = function(card){

		if(!progam) return;
		self.position = program.position;

		$titlecardLayer.show();
		card = card.content;
		var obj = {
			"text": card["message"],
			"align": card["align"],
			"effect": card["effect"],
			"duration": 60,
			"fontSize": card["size"],
			"fontColor": card["color"],
			"fontStyle": card["style"],
			"fontWeight": card["weight"],
			"backgroundColor": card["bgcolor"],
			"backgroundImage" : card["bgimage"]
		};
		var setTimer = function(){
			clearInterval(interval);
			interval = setInterval(function(){
				self.programSecond += 1;
			}, 1000);
		}
		$titlecardLayer.titlecard(obj, function(){
			clearInterval(interval);
			onItemEnd();
		});
		setTimer();
	}
	var onItemEnd = function(program){
		if(program){
			manager.discardVideo(program.content.videoId);
		}else{
			$titlecardLayer.hide();
		}
		isPlaying = false;
		lineupItem = lineup.next();
		if(lineupItem === false){
			$(self).trigger("episodeEnd");
		}else{
			playItem();
		}
	}
	var playItem = function(){
		var type = lineupItem.type;
		if(type === "program"){
			playProgram(lineupItem);
		}else if(type === "titleCard"){
			playTitleCard(lineupItem);
		}

		preloadNextItem();
	}
	var preloadNextItem = function(){
		var nextItem = lineup.next(false);
		if(nextItem.type === "program"){
			manager.preloadVideo(nextItem.content.videoId);
		}
	}
	this.currentSecond = 0;
	this.programSecond = 0;
	this.position = 0;
	this.progress = function(){
		return Math.round((this.currentSecond/this.episode.duration)*10000)/10000;
	}
	this.seekToSecond = function(sec){

	}

	this.seekToLineupIndex = function(index){
		this.pause();
		manager.discardCurrent();
		$(player).unbind();
		lineupItem = lineup.goto(index);
		playItem();
	}

	this.seekToSubepisode = function(id){

	}

	this.playEpisode = function(episode){
		this.episode = episode;
		lineup = new nn.utils.NnArray(episode.lineup, false);
		lineupItem = lineup.first();

		this.currentSecond = 0;
		this.programSecond = 0;
		this.position = 0;
		playItem();
	}

	this.nextSubepisode = function(){
		lineupItem = lineup.next();
		if(lineupItem === false){
			return false;
		}
		this.pause();
		manager.discardCurrent();
		$(player).unbind();
		playItem();
	}

	this.prevSubepisode = function(){
		lineupItem = lineup.prev();
		if(lineupItem === false){
			return false;
		}
		this.pause();
		manager.discardCurrent();
		$(player).unbind();
		playItem();
	}

	this.play = function(){

	}

	this.pause = function(){
		if(player){
			player.ready().then(function(){
				player.pauseVideo();
			});
		}
	}
};

_n.PopUpManager = function(){

};

_n.GAManager = function(){

};

_n.PDRManager = function(){
	
};

_n.CookieManager = function(){

};

