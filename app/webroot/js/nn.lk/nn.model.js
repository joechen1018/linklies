/************************************************************/
// dependency :nn.parser
/************************************************************/
var nn = nn || {};
nn.model = nn.model || {};
nn.model.loader = nn.model.loader || {};
nn.model.request = nn.model.request || {};
/******************************/
_n = nn.model.loader;
/******************************/

_n._load = function(apiName, q){
	var getway = "/playerAPI/";
	var def = $.Deferred();
	$.get(getway + apiName + "?" + q, function(data){
		if(data.split("\t")[0] === "0"){
			def.resolve(data);
		}else{
			def.reject(data);
		}
	});
	return def.promise();
}
_n._fetchPlaylists = function(ytID, startIndex, max, order){

	startIndex = startIndex || 1;
	max = max || 50;
	order = order || "position";

	var def = $.Deferred();
	var url = "http://gdata.youtube.com/feeds/api/playlists/" + ytID + "?v=2&alt=json&start-index="+startIndex+"&max-results="+max+"&orderby=" + order;
	$.get(url, function(json){
		def.resolve(json);
	});
	return def.promise();
}
_n._fetchUserChannel = function(ytID, startIndex, max, order){

	startIndex = startIndex || 1;
	max = max || 50;
	order = order || "published";

	var def = $.Deferred();
	var url = "http://gdata.youtube.com/feeds/api/users/" + ytID + "/uploads?v=2&alt=json&start-index="+startIndex+"&max-results="+max+"&orderby=" + order;

	$.get(url, function(json){
		def.resolve(json);
	});
	return def.promise();
}
_n._queryString = function(args){
	args.v = nn.global.v;
	args.mso = nn.global.mso;
	args.rx = Math.floor(Math.random()*100000000000);
	var q = "";
	for(var key in args){
		q += key + "=" + encodeURI(args[key]) + "&";
	}
	return q.substr(0, q.length-1);
}


/******************************/
_n = nn.model.request;
/******************************/

_n.ApiRequest = function(apiName, vars){
	var loader = nn.model.loader;
	var q = loader._queryString(vars);
	var isLoaded = false;
	var csv;
	this.done = function(){
		var def = $.Deferred();
		if(isLoaded){
			def.resolve(csv);
			//return def.promise();
		}
		loader._load(apiName, q).then(function(data){
			isLoaded = true;
			csv = data;
			def.resolve(csv);
		});
		return def.promise();
	};
	/*
	 *	Reload data from the server.
	 *	Uncomment this if needed.
	 */
	// this.refresh = function(){
	// 	var def = $.Deferred();

	// 	isLoaded = false;
	// 	csv = null;

	// 	loader._load(apiName, q).then(function(data){
	// 		isLoaded = true;
	// 		csv = data;
	// 		def.resolve(csv);
	// 	});

	// 	return def.promise();
	// };
};
_n.YoutubeRequest = function(){

	var def = $.Deferred();
	var loader = nn.model.loader;
	var isLoaded = false;
	var type = 0, rs;
	this.getPlayList = function(youtubeId){
		if(type === 2) return;
		type = 1;
		if(isLoaded){
			def.resolve(rs);
			def.resolive();
		}
		loader._fetchPlaylists(youtubeId).then(function(json){
			rs = json;
			isLoaded = true;
			def.resolve(json);
		});
		return def.promise();
	}
	this.getUserChannel = function(youtubeId){
		if(type === 1) return;
		type = 2;
		loader._fetchUserChannel(youtubeId).then(function(json){
			rs = json;
			isLoaded = true;
			def.resolve(json);
		});
		return def.promise();
	}
	this.done = function(){
		if(isLoaded){
			def.resolve(rs);
			return def.promise();
		}
		loader._load(apiName, q).then(function(csv){
			rs = csv;
			isLoaded = true;
			def.resolve(rs);
		});
		return def.promise();
	}
}

/******************************/
_n = nn.model;
/******************************/

_n.UserChannels = function(user){
	var request = new nn.model.request.ApiRequest("channelLineup", {user : user});
	
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("channels", csv);
			$.extend(true, self, parsed);
			def.resolve();
		});
		return def.promise();
	}
}

_n.Channel = function(id){
	var request = new nn.model.request.ApiRequest("channelLineup", {"channel" : id});
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("channel", csv);
			$.extend(true, self, parsed);
			//console.log(self);
			def.resolve(self);
		});
		return def.promise();
	};
};


// //called with every property and it's value
// function process(key,value) {
// 	//console.debug($.type(value));
// 	//console.debug(key + " : "+value);
// 	//var str = "channels4_banner.jpg";
// 	var str = "googleusercontent";
// 	if($.type(value) === "string"){
// 		if(value.indexOf(str) !== -1){
// 			console.debug(value);
// 		}
// 	}
// }

// function traverse(o,func) {
//     for (var i in o) {
//         func.apply(this,[i,o[i]]);  
//         if (o[i] !== null && typeof(o[i])=="object") {
//             //going on step down in the object tree!!
//             traverse(o[i],func);
//         }
//     }
// }

_n.Episodes = function(channel){
	var nature = channel.nature;
	var request;
	var type = 1;
	var self = this, parsed;
	if(nature == "6" || nature == "8" || nature == "11"){
		request = new nn.model.request.ApiRequest("programInfo", {"channel" : channel.id});
	}else if(nature == "3"){
		type = 2;
		request = new nn.model.request.YoutubeRequest();
	}else if(nature == "4"){
		type = 3;
		request = new nn.model.request.YoutubeRequest();
	}
	this.get = function(){
		var def = $.Deferred();
		if(type === 1){
			request.done().then(function(csv){
				parsed = nn.parser.parse("episodes", csv);
				$.extend(true, self, parsed);
				def.resolve();
			});
		}else if(type === 2){
			request.getUserChannel(channel.youtubeID).then(function(json){
				parsed = nn.parser.youtubeParse(json, channel);
				$.extend(true, self, parsed);
				def.resolve();	
			});
		}else if(type === 3){
			request.getPlayList(channel.youtubeID).then(function(json){
				parsed = nn.parser.youtubeParse(json, channel);
				$.extend(true, self, parsed);
				def.resolve();
			});
		}
		return def.promise();
	};
};

_n.Categories = function(lang){
	var request = new nn.model.request.ApiRequest("category", {"lang" : lang});
	
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("categories", csv);
			$.extend(true, self, parsed);
			def.resolve();
		});
		return def.promise();
	};
};

_n.Set = function(setId){
	var request = new nn.model.request.ApiRequest("setInfo", {set : setId});
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("set", csv);
			$.extend(true, self, parsed);
			def.resolve();
		});
		return def.promise();
	};
};

_n.Portal = function(mso, minimal, lang, time){
	mso = mso || "9x9";
	minimal = minimal || true;
	lang = lang || "zh";
	time = time || new Date().getHours();
	var request = new nn.model.request.ApiRequest("portal", {
		"minimal": minimal,
		"lang": lang,
		"time": time,
		"mso" : mso
	});
	
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("portal", csv);
			$.extend(true, self, parsed);
			def.resolve();
		});
		return def.promise();
	};
};

_n.UserGrids = function(user){

};

_n.UserHistory = function(user){
	var request = new nn.model.request.ApiRequest("personalHistory", {user : user});
	var self = this, parsed;
	this.get = function(){
		var def = $.Deferred();
		request.done().then(function(csv){
			parsed = nn.parser.parse("userHistory", csv);
			$.extend(true, self, parsed);
			def.resolve();
		});
		return def.promise();
	};
};

_n.UserSettings = function(){

};

_n.UserPreference = function(){

};

