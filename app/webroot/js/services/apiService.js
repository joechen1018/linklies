app.service("apiService", function($http, contentParser){
	return {
		linkService : {
			get : function(id){
				var _d = $.Deferred();
				$.ajax({
					url : root + "api/fetchById/link/" + id,
					method : "get",
					success : function(res){
						//console.log(res);
						var obj = res.data.Link;
						_d.resolve(obj);
					},
					fail : function(err){
						console.log(err);
					}
				});
				return _d.promise();
			},
			create : function(url){
				var _d = $.Deferred();
				$.ajax({
					url : "api/fetchUrl",
					method : "post",
					data : {"url" : url},
					success : function(res){
						//console.log(res);
						contentParser.parse(res, url).then(function(obj){
							//console.log(obj);
							_d.resolve(obj);
						});
					},
					fail : function(err){
						_d.reject();
						console.log(err);
					}
				});
				return _d.promise();
			},
			save : function(link){
				link.grid = link.grid.join(",");
				link.meta = JSON.stringify(link.meta);
				link.type = JSON.stringify(link.type);
				link.allowIframe = link.allowIframe ? 1 : 0;
				// _c.log(link);
				var _d = $.Deferred();
				$.ajax({
					url : "api/save/link",
					method : "post",
					data : link,
					success : function(res){
						res.data.Link.grid = res.data.Link.grid.split(",");
						_d.resolve(res);
					}
				});
				return _d.promise();
			},
			remove : function(id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/removeById/link/" + id,
					method : "get",
					success : function(res){
						_d.resolve(res);
					}
				});
				return _d.promise();
			}
		},
		folderService : {
			create : function(){

			},
			save : function(folder){
				folder.grid = folder.grid.join(",");
				//_c.log(folder);
				var _d = $.Deferred();
				$.ajax({
					url : "api/save/folder",
					method : "post",
					data : folder,
					success : function(res){
						var data = res.data.Folder;
						data.grid = data.grid.split(",");
						_d.resolve(data);
					}
				});
				return _d.promise();
			},
			remove : function(id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/removeById/folder/" + id,
					method : "get",
					success : function(res){
						_d.resolve(res);
					}
				});
				return _d.promise();
			}
		},
		getUser : function(username_id){
			var _d = $.Deferred();
			$.ajax({
				url : "api/user/" + username_id,
				method : "get",
				success : function(data){
					// console.log(data);
					_d.resolve(data);
				}
			});
			return _d.promise();
		}
	}
})

.service("contentParser", function(){
	
	var contentTypes = {
		"youtube" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(youtube\.com)\/.+$",
			ico : "http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png"
		},
		"youtube.watch" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$",
			ico : "http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
			embedUrl : "http://www.youtube.com/embed/{{VIDEO_ID}}?autoplay=1"
		},
		"vimeo.watch" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(vimeo\.com\/[0-9]+)",
			ico : "http://a.vimeocdn.com/images_v6/favicon_32.ico",
			embedUrl : "//player.vimeo.com/video/{{VIDEO_ID}}?autoplay=1"
		},
		"google" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(google\.com.*)\/.+$",
			ico : "https://www.google.com.tw/favicon.ico"
		},
		"tw.google" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(google\.com\.tw)\/.+$",
			ico : "https://www.google.com.tw/favicon.ico"
		},
		"google.drive" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(drive\.google\.com.*)\/.+$",
			ico : "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico"
		},
		"google.translate" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(translate\.google\.com.*)\/.+$",
			ico : "http://translate.google.com.tw/favicon.ico"
		},
		"google.docs" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com)\/.+$",
			ico : "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico"
		},
		"google.docs.spreadsheet" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com/spreadsheet)\/.+$",
			ico : "https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png"
		},
		"google.docs.document" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com/document)\/.+$",
			ico : "https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico"
		},
		"google.docs.drawings" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com/drawings)\/.+$",
			ico : "https://ssl.gstatic.com/docs/drawings/images/favicon5.ico"
		},
		"google.docs.presentations" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com/presentation)\/.+$",
			ico : "https://ssl.gstatic.com/docs/presentations/images/favicon4.ico"
		},
		"google.docs.forms" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(docs\.google\.com/forms)\/.+$",
			ico : "https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_jfk2.png"
		}
	};
	this.parse = function(content, url){
		var rs = {};
		var d = $.Deferred();
		rs.type = {};
		rs.type.name = "default";
		rs.types = [];
		rs.html_source = content;
		rs.view = "default";

		//** detect iframe policy
		rs.allowIframe = (function(str){
			return str.indexOf("X-Frame-Options") === -1 ? true : false;
		})(content);

		//** append dom for manipulation
		var holder = $("#dom-holder");
		var $html = $.parseHTML(content);
		for(var i = $html.length - 1; i>-1; i--){
			//_c.log($html[i].nodeName);
			if($html[i].nodeName.toLowerCase() == "link" || $html[i].nodeName.toLowerCase() == "script"){
				$html.splice(i, 1);
			}
		}
		//_c.log($html);
		holder.html("").append($html);
		var type;
		var pattern;
		for(var i in contentTypes){
			pattern = new RegExp(contentTypes[i].match);
			if(pattern.test(url)){
				for(var j in contentTypes[i]){
					rs.type[j] = contentTypes[i][j];
				}
				rs.type.name = i;
			}
		}


		//** find meta
		rs.meta = {};
		var meta = {};
		holder.find("meta[property], meta[name]").each(function(i, e){
			var name = $(this).attr("property") || $(this).attr("name");
			rs.meta[name] = $(e).attr("content");
			meta[name] = $(e).attr("content");
		});
		/*
		_c.log(rs.meta);
		_c.log(rs);
		_c.log(rs.hasOwnProperty("meta"));
		*/
		/*var pl = purl(url);
		rs.purl = pl;*/
		rs.url = url;

		//** find title
		rs.title = holder.find("title").eq(0).html();

		//** find ico
		if(rs.type.ico){
			rs.ico = rs.type.ico;
		}else{

			//** get all link tag
			var links = holder.find("link[rel*='ico'][href]");
			var href;
			var testLink=function(e){var t=e.attr("rel");if(t.split("-").length>1){return 0}if(t.indexOf("shortcut")!==-1&&t.indexOf("icon")!==-1){return 3}if(t.indexOf("shortcut")!==-1&&t.indexOf("ico")!==-1){return 2}if(t.indexOf("ico")!==-1||t.indexOf("icon")!==-1){return 1}}

			/**
			 * give each link rel a score
			 0 - rel contains '-' 
			 1 - rel contains 'ico' or 'icon'
			 2 - rel contains 'shortcut' or 'ico'
			 3 - rel contains 'shortcut' and 'icon'
			**/
			var scores = [];
			links.each(function(i, e){
				scores.push({
					score : testLink($(e)),
					href : $(e).attr("href")
				});
			});

			//** get the link with max score
			var max=_.max(scores,function(e){return e.score})

			//** get the index of the link with max score
			var maxIndex = _.indexOf(scores, max);
			href = max.href;

			//** test absolute url
			var testA=function(e){if(e===undefined)return false;if(/^https?:\/\//i.test(e)||e.substr(0,2)==="//"){return true}return false}
			

			//if(testA(href)){
			if(true){
				rs.ico = href;
			}else{
				// relative url
				// example img/favicon.ico
				var host = pl.attr("host");
				var makeGuess = function(href){
					//relative to current
					var dir = pl.attr("directory");
					var guess;
					if(href === undefined){
						guess = "http://" + host + "/favicon.ico";
					}else{
						guess = "http://" + host + dir + href;
					}
					rs.ico = guess;
					rs.guesses = ["http://" + host + "/favicon.ico"];
				}
				if(href === undefined){
					makeGuess(undefined);
				}
				else if(href.substr(0,1) == "/"){
					//relative to base
					rs.ico = "http://" + host + href;
				}else{
					makeGuess(href);
				}
			}
		}
		//console.log(rs.ico);
		//console.log(rs.type.name);
		var type = rs.type;
		var arr = type.name.split(".");
		switch(type.name){
			case 'youtube.watch' :
			case 'vimeo.watch' :
				if(arr[0] === "youtube"){
					rs.videoId = url.split("?v=")[1].split("&")[0];
				}else{
					rs.videoId = url.split("/")[url.split("/").length - 1];
				}
				// _c.log(rs.videoId);
				rs.type.videoId = rs.videoId;
				rs.view = "video";
				rs.meta = meta;
				rs.meta1 = meta;
				d.resolve(rs);
			break;
			case 'google.translate':
				// var source = holder.find("textarea#source").eq(0).val();
				// var result = holder.find("span#result_box").eq(0).html();
				// rs.title = source + " : " + result;
				d.resolve(rs);
			break;
			case 'google.docs.spreadsheet' : 
				rs.gdocKey = rs.purl.param("key");
				var request = gapi.client.drive.files.get({
				    'fileId': rs.gdocKey
				});
				request.execute(function(resp) {
					//_c.log(resp);
					rs.doc = {};
					rs.doc.spreadsheet = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";

					d.resolve(rs);
				    // console.log('Title: ' + resp.title);
				    // console.log('Description: ' + resp.description);
				    // console.log('MIME type: ' + resp.mimeType);
				});
			break;
			case 'google.docs.document' : 
				rs.gdocKey = findKey.d();
				var request = gapi.client.drive.files.get({
				    'fileId': rs.gdocKey
				});
				request.execute(function(resp) {
					// _c.log(resp);
					rs.doc = {};
					rs.doc.document = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";
					// _c.log(rs);
					d.resolve(rs);
				    // console.log('Title: ' + resp.title);
				    // console.log('Description: ' + resp.description);
				    // console.log('MIME type: ' + resp.mimeType);
				});
			break;
			case "google.docs.presentations" :
				rs.gdocKey = findKey.d();
				// console.log(rs.gdocKey);
				var request = gapi.client.drive.files.get({
				    'fileId': rs.gdocKey
				});
				request.execute(function(resp) {
					_c.log(resp);
					rs.doc = {};
					rs.doc.presentation = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";
					
					d.resolve(rs);
				});
			break;
			default : 
				_c.log(rs);
				d.resolve(rs);
			break;
		}
		//** dom query completed, remove dom
		holder.html("");
		return d.promise();

	}

	this.flatten = function(arr, model){
		var rs = [], item;
		for(var i = 0; i<arr.length; i++){
			item = arr[i][model];
			rs.push(item);
		}
		return rs;
	}
})


.service("uuid", function(){
	return {
		create : function(){
			var d = new Date().getTime();
		    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (d + Math.random()*16)%16 | 0;
		        d = Math.floor(d/16);
		        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		    });
		    return uuid;
		}
	}
});