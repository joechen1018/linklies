/************************************************************/
// dependency : nn.model, nn.utils
/************************************************************/
var nn = nn || {};
nn.parser = nn.parser || {};
nn.parser.extendables = nn.parser.extendables || {};

nn.parser.mappings = {
	channel : ["grid","id","name","description","images","programCount","type","status","nature","youtubeID","lastUpdated","sorting","piwikID","lastWatchedEpisode","youtubeRealChannelName","subscriptionCount","viewCount","tags","curatorID","curatorName","curatorDescription","curatorImage","subscriberIDs","subscriberImages","lastEpisodeTitle","poi"],
	episode : ["channelId", "id", "names", "descriptions", "types", "durations", "thumbs", "thumbsLarge", "url1", "url2", "url3", "url4", "published", "reversed", "titleCards", "poi"],
	poi : ["subEpisodePos", "start", "end", "type", "content"],
	titleCard : ["type", "subepisode", "message", "duration", "style", "size", "color", "effect", "align", "bgcolor", "weight", "bgimage"],
	portal : ["id", "name", "description", "images", "channelCount"],
	set :　["id", "name", "imageUrl"]
};

/******************************/
_n = nn.parser.extendables;
/******************************/

_n.episodeLoader = {
	loadEpisodes : function(){
		var ch = this;
		var episodes = new nn.model.Episodes(ch);
		var def = $.Deferred();
		episodes.get().then(function(){
			ch.episodes = episodes;
			def.resolve();
		});
		return def.promise();
	}
};

_n.episodeParser = {
	parseEpisode : function(){

		//fix some episodes being lack of duration so it'll still play
		for(var i = 0; i<this.durations.length; i++){
			if(this.durations[i] == 0){
				this.durations[i] = 60;
			}
		}

		//get episode attribute from first element of the given array
		this.name = $.type(this.names) === "array" ? this.names[0] : this.names;
		this.duration = $.type(this.durations) === "array" ? this.durations[0] : this.durations;
		this.duration = this.duration == 0 ? 60 : this.duration;
		this.thumb = this.thumbs[0];
		this.thumbLarge = this.thumbsLarge[0];

		//get rid of the first attributes since we already got them
		if($.type(this.url1)  === "array" && this.url1[0] === ""){
			this.names.shift();
			this.url1.shift();
			this.types.shift();
			this.thumbs.shift();
			this.durations.shift();
			this.subEpisodeCount = this.url1.length;
		}

		this.programs = [];
		var len = parseInt(this.subEpisodeCount || 1,10), vid, sp, sp1, l;
		var _n = nn.parser;
		var titleCards = this.titleCards || "";
		for(var i = 0; i<len; i++){
			
			sp = $.type(this.url1) === "array" ? this.url1[i].split("v=") : this.url1.split("v=");
			vid = sp[1];
			sp1 = vid.split(";");
			l = sp1.length;
			 
			vid = sp1[0];
			
			if(sp1.length > 2){
				sp1.shift();
			}else{
				sp1 = [0, this.duration];
			}
			var check = function(str, bool){
				if((str === "" || str === undefined) && bool === true){
					return 60;
				}else if(str === "" || str === undefined){
					return 0;
				}else{
					var rs = parseInt(str, 10);
					return $.type(rs) === "number" ? rs : 0;
				}
			}
			var start = check(sp1[0]);
			var end = check(sp1[1], true); 
			var dur = check(this.durations[i], true);
			var pg = {
				id : "ep" + vid,
				name : $.type(this.names) === "array" ? this.names[i] : this.names,
				thumb : $.type(this.thumbs) === "array" ? this.thumbs[i] : this.thumbs,
				url : $.type(this.url1) === "array" ? this.url1[i] : this.url1,
				videoId : vid,
				startSeconds : start,
				endSeconds : end,
				titleCards : _n._createTitleCards(titleCards, i),
				duration : dur
			}
			$.extend(true, pg, nn.parser.extendables.subEpisode);
			this.programs.push(pg);
			nn.parser._parseLineup(this);
		}
		var fn = function(poi){
			if(poi === undefined){
				return [];
			}
			else if($.isArray(poi)){
				return poi;
			}else if(poi.length > 0){
				return [poi];
			}
			return [];
		}
		var poi = fn(this.poi);
		var pos, n = 0;
		var isNum = function (num) {return (num >=0 || num < 0);}
		var s = 0, e = 0;
		for(var i = 0; i<poi.length; i++){
			this.poi[i] = nn.parser._parsePOI(poi[i]);
			pos = parseInt(poi[i].subEpisodePos, 10);
			n = 0;
			if(isNum(pos)){
				pos-=1;
				for(var j = 0; j<this.lineup.length; j++){
					if(this.lineup[j].type == "program"){
						if(n == pos){
							s = parseInt(this.lineup[j].content.startSeconds, 10);
							n = parseInt(poi[i].start);
							poi[i].start = n - s;
							n = parseInt(poi[i].end);
							poi[i].end = n - s;
							this.lineup[j].poi.push(poi[i]);
						}
						n++;
					}
				}
			}
		}
		nn.parser._parseLineup(this);
	}
};

_n.mapper = {
	map : function(arr, fields){
		for(var i = 0; i<fields.length; i++){
			if(fields[i]){
				this[fields[i]] = arr[i];
			}else{
				this[i+""] = arr[i];
			}
		}
	}
};

/******************************/
_n = nn.parser;
/******************************/

_n.YTEpisode = function(data){
	var ep, te;
	var len = 0;
	var len = 1;
	
	this.data = data;
	this.programs = Array();
	this.currentIndex = 0;
	this.duration = 0;
	this.durations = Array();
	this.positions = Array();
	this.lineup = Array();
	this.titleCards = [];
	this.thumb = data["programThumbnailUrl"][0];
	this.published = parseInt(data["published"],10);
	this.name = data["programName"][0]; 
	this.durations = data["duration"];
	this.duration = data["duration"][0];
	this.id = data["id"];
	this.next = function(){
		return false;
	}
	this.prev = function(){
		return false;
	}
	
	var sp = data["url1"][0].split("v=");
	var vid = sp[1];
	var sp1 = vid.split(";"); 
	vid = sp1[0];
	
	if(sp1.length > 2){
		sp1.shift();
	}else{
		sp1 = [0, this.duration];
	}
	
	pg = {
		id : "yt" + vid,
		name : data["programName"][0],
		thumb : data["programThumbnailUrl"][0],
		url : data["url1"][0],
		videoId : vid,
		startSeconds : parseInt(sp1[0]),
		endSeconds : parseInt(sp1[1]),
		titleCards : {
			"begin" : false,
			"end" : false
		},
		duration : this.duration
	}
	this.programs.push(pg);
	
	this.lineup = [{
		"type" : "program",
		"duration" : this.duration,
		"position" : 0,
		"content" : pg
	}];
}

_n._createTitleCards = function(data, index){

	var decodeurl = function(str){
		return decodeURIComponent((str+'').replace(/\+/g, '%20'));
	}
	data = decodeurl(data);
	var arr = data.trim().split("--\n");
	for(var i = 0; i<arr.length; i++){
		arr[i] = nn.parser._parseTitleCard(arr[i]);
	}
	var cards = {
		"begin" : false,
		"end" : false
	};
	var j;
	var card = arr[i];
	for(var i = 0; i<arr.length; i++){
		j = parseInt(arr[i].subepisode, 10) - 1;
		if(index == j){
			if(arr[i]["type"] == "begin"){
				cards["begin"] = arr[i];
			}else{
				cards["end"] = arr[i];
			}
		}
	}
	return cards;
}

_n._parseTitleCard = function(card){
	var arr = card.split("\n");
	var fields = nn.parser.mappings.titleCard;
	var obj = {}, split;
	for(var i = 0; i<arr.length; i++){
		split = arr[i].split(":");
		if(split.length === 2){
			obj[split[0]] = split[1].trim();
		}else if(split.length > 2){
			obj.bgimage = "http:" + split[2];
		}
	}
	return obj;
};

_n._parseLineup = function(ref){
	var len = ref.programs.length*3;
	var n = 0;
	var positions = Array();
	
	ref.lineup = [];
	ref.positions = [];
	
	/** expand the array to fit title cards, 
	 * videos are in the middle of every 3 items */
	var j;
	for(var i = 0; i<len; i++){
		if(i%3 == 1){
			j = Math.ceil(i/3) -1;
			ref.lineup[i] = {
				type : "program",
				position : 0,
				duration : ref.durations[j],
				content : ref.programs[j],
				poi : []
			};
		}else{
			j = Math.floor(i/3);
			ref.lineup[i] = {
				type : "",
				position : 0,
				duration : 0,
				content : null,
				poi : []
			};
		}
		positions[i] = 0;
	}
	
	ref.titleCards = [];
	for(i = 0; i<ref.programs.length; i++){
		if(ref.programs[i].titleCards.begin){
			ref.titleCards.push(ref.programs[i].titleCards.begin);
		}
		if(ref.programs[i].titleCards.end){
			ref.titleCards.push(ref.programs[i].titleCards.end);
		}
	}
	
	var begin, end, card, p;
	for(i = 0; i<ref.titleCards.length; i++){
		card = ref.titleCards[i];
		if(card.subepisode){
			n = parseInt(card.subepisode, 10) -1;
			begin = n * 3;
			end = begin + 2;
			if(card.type == "begin"){
				n = begin;
			}else{
				n = end;
			}
			ref.lineup[n] = {
				type : "titleCard",
				position : 0,
				duration : parseInt(card.duration,10),
				content : card
			};
		}
	}
	
	//remove 0 durations
	for(i = ref.lineup.length-1; i>-1; i--){
		if(ref.lineup[i].duration == 0){
			ref.lineup.splice(i,1);
		}
	}
	
	p = 0;
	if(ref.lineup.length>1){
		for(i = 0; i<ref.lineup.length; i++){
			ref.positions.push(p);
			ref.lineup[i].position = p;
			p += parseInt(ref.lineup[i].duration,10);
		}
	}
}

_n._parsePOI = function(poi){
	var item, items, obj = {};
	var _try = function(a, b){ try{	return eval(a);	}catch(e){ return b ? b : "";}};
	var rs = [];
	var urldecode = function(str){
		return decodeURIComponent((str+'').replace(/\+/g, '%20'));
	}
	item = poi;
	items = item.split(";");
	obj = {
		"subEpisodePos" : _try("items[0]"),
		"start" : _try("items[1]", 0),
		"end" : _try("items[2]", 0),
		"type" : _try("items[3]"),
		"content" : _try("JSON.parse(urldecode(items[4]))")
	}
	return obj;
}

_n._map = function(arr, mapping){
	var tmp = {};
	for(var i = 0; i<arr.length; i++){
		if(mapping[i]){
			tmp[mapping[i]] = arr[i];
		}else{
			tmp[i+""] = arr[i];
		}
	}
	return tmp
}

_n._obj = function(data){
	var arr = data.trim().split("\n");
	var obj = {}, tmp;
	for(var i = 0; i<arr.length; i++){
		tmp = arr[i].split(":");
		if(tmp.length === 2){
			obj[tmp[0].trim() + ""] = tmp[1].trim();
		}
	}
	return obj;
}

_n.breakDown = function(data){
	var obj = {};
	var blocks = data.split("--\n");
	var rs = blocks[0].split("\t");
	obj.response = {
		code : rs[0],
		desc : rs[1].trim()
	}
	blocks.shift();
	var lines, line, cell;
	for(var i = 0; i<blocks.length; i++){
		lines = blocks[i].trim().split("\n");
		for(var j = 0; j<lines.length; j++){
			lines[j] = lines[j].split("\t");
			for(var k = 0; k<lines[j].length; k++){
				cell = lines[j][k].split("|");
				if(cell.length>1){
					lines[j][k] = cell;
				}
			}
		}
		blocks[i] = lines;
	}
	obj.blocks = blocks;
	return obj;
}

_n.youtubeParse = function(data, channel){
	var now = new Date();
	var arr = [];
	if (data && data.feed){
		feed = data.feed;

		var name = feed.author[0].name.$t;
		var name1 = feed.author[0].uri.$t.split("/");
		name1 = name1[name1.length-1];
		
		// name1 = name1.toLowerCase();
		// name = name.toLowerCase();

		// playlists are different
		// "tag:youtube.com,2008:playlist:45f1353372bc22eb"
		var ytid = feed.id.$t;
		if (ytid.match(/playlist:/)) name = ytid.match(/playlist:(.*)$/)[1];
		
		// if(ytid == "tag:youtube.com,2008:user:cowboy731216:uploads"){
			// console.debug("found ma");
		// }

		var entries = feed.entry || [];
		var entry;
		for (var i = 0; i < entries.length; i++){
			entry = entries[i];
			if(entry.media$group.yt$duration && entry.media$group.yt$videoid){
				
				var video_id = entry.media$group.yt$videoid.$t;
				var id = "yt" + video_id;
				var title = entry.title.$t;
				var updated = entry.updated.$t;
				var duration = entry.media$group.yt$duration.seconds;
				var dtime = entry.media$group.yt$uploaded.$t;
				var timestamp = new Date(dtime);
				var thumb = entry.media$group.media$thumbnail[1]['url'];
				var ts = timestamp.getTime();
				if (ts == undefined || isNaN(ts) || ts == Infinity) ts = now.getTime();
				
				var program_id = channel + '.' + video_id;
				var obj = {
					'id': id,
					'url1': ['http://www.youtube.com/watch?v=' + video_id],
					'url2': '',
					'url3': '',
					'url4': '',
					'name': title,
					'programName': [title],
					'desc': '',
					'type': '',
					'programThumbnailUrl': [thumb],
					'snapshot': thumb,
					'published': ts,
					'duration': [duration],
					'durations' : [duration],
					'sort': i + 1,
					'videoId' : video_id
				};
				var episode = new nn.parser.YTEpisode(obj);
				arr.push(episode);
			}
		}
	}
	return new nn.utils.NnArray(arr);
}

_n.parse = function(parseType, csv){

	var _n = nn.parser;
	var breakDowns = _n.breakDown(csv);
	var blocks = breakDowns.blocks;
	var extendables = _n.extendables;
	if(breakDowns.response.code === "0"){
		var obj = {}, arr = [], line, lines;
		if(parseType === "channel"){
			lines = blocks[0];
			line = lines[0];
			$.extend(true, obj, extendables.mapper, extendables.episodeLoader);
			obj.map(line, _n.mappings.channel);
			return obj;
		}else if(parseType === "channels"){
			lines = blocks[0];
			arr = [];
			for(var i = 0; i<lines.length; i++){
				obj = {};
				$.extend(true, obj, extendables.mapper, extendables.episodeLoader);
				obj.map(lines[i], _n.mappings.channel);
				arr[i] = obj;
			}
			return new nn.utils.NnArray(arr);
		}else if(parseType === "episode"){



		}else if(parseType === "episodes"){
			lines = blocks[0];
			arr = [];
			for(var i = 0; i<lines.length; i++){
				line = lines[i];
				obj = {};
				$.extend(true, obj, extendables.mapper);
				obj.map(line, _n.mappings.episode);

				$.extend(true, obj, extendables.episodeParser);
				obj.parseEpisode();
				arr[i] = obj;
			}
			return new nn.utils.NnArray(arr);
		}else if(parseType === "categories"){



		}else if(parseType === "set"){

			//channels
			lines = blocks[2];
			arr = [];
			var obj1 = {};
			for(var i = 0; i<lines.length; i++){
				obj = {};
				$.extend(true, obj, extendables.mapper, extendables.episodeLoader);
				obj.map(lines[i], _n.mappings.channel);
				arr[i] = obj;
			}
			obj1.channels = new nn.utils.NnArray(arr);

			lines = blocks[3];
			arr = [];
			for(var i = 0; i<lines.length; i++){
				line = lines[i];
				obj = {};
				$.extend(true, obj, extendables.mapper);
				obj.map(line, _n.mappings.episode);

				$.extend(true, obj, extendables.episodeParser);
				obj.parseEpisode();
				arr[i] = obj;
			}
			obj1.episodes = new nn.utils.NnArray(arr);
			return obj1;

		}else if(parseType === "portal"){

			lines = blocks[0];
			arr = [];
			for(var i = 0; i<lines.length; i++){
				obj = {};
				$.extend(true, obj, extendables.mapper);
				obj.map(lines[i], _n.mappings.portal);
				arr[i] = obj;
			}
			return new nn.utils.NnArray(arr);

		}else if(parseType === "userGrids"){



		}else if(parseType === "userHistory"){



		}else if(parseType === "userSetting"){



		}else if(parseType === "userPreference"){



		}
	}else{
		console.error(parsed.response);
	}
}