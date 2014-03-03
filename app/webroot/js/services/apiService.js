app.service("apiService", function($http, apiParser){
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
						//** return parsed html - *notice this is just a part of the Link object
						apiParser.parse(res, url).then(function(obj){
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
				var obj = apiParser.linkToDb(link);
				var _d = $.Deferred();
				$.ajax({
					url : "api/save/link",
					method : "post",
					data : obj,
					success : function(res){
						var link = apiParser.linkFromDb(res.data.Link);
						_d.resolve(link);
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

.service("apiParser", function(urlTypes){
	
	var self = this;
	this.parseGoogleResult = function($list){
		var rs = [];
		$list.each(function(i, e){
			rs.push({
				title : $(e).find("h3.r>a:first-child").text(),
				href : $(e).find("h3.r>a:first-child").attr("href"),
				date : $(e).find("span.st>span.f").text().split("-")[0]
			});
		});
		return rs;
	}

	this.linkToDb = function(link){
		//** deep clone the object so it won't effect working view
		var obj = utils.clone(link);

		//** prepare data for saving
		obj.type = JSON.stringify(link.type);
		obj.grid = link.grid.join(",");
		obj.meta = JSON.stringify(link.meta);
		obj.allowIframe = link.allowIframe ? 1 : 0;

		return obj;
	}

	this.linkFromDb = function(link){

		var saveParse = function(str){
			try{
				return JSON.parse(str);
			}catch(e){
				_c.warn("JSON parse error")
			}
			return {};
		}
		//** string to json
		if(typeof link.type === "string" && link.type.length > 2){
			link.type = saveParse(link.type);
		}

		//** string to array
		if(typeof link.grid === "string"){
			link.grid = link.grid.split(",");
		}
		if(typeof link.grid === "array" && link.grid.length === 2){
			link.grid[0] = parseInt(link.grid[0], 10);
			link.grid[1] = parseInt(link.grid[1], 10);
		}

		//** string to json
		if(typeof link.meta === "string" && link.meta.length > 2){
			link.meta = saveParse(link.meta);
		}
		//** string to boolean
		if(typeof link.allowIframe === "string"){
			link.allowIframe = parseInt(link.allowIframe) === 0 ? false : true;
		}

		//** initial state
		link.state = {
			name : "ready"
		}
		//** initial view variables
		link.dragging = false;
		return link;
	}

	this.requestTranslate = function(params){
		var api = 'https://www.googleapis.com/language/translate/v2?key={{clientId}}&source={{source}}&target={{target}}&callback={{callback}}&q={{q}}',
			url = utils.replace(api, {
				clientId : glob.apiKey,
				source : params.source,
				target : params.target,
				q : escape(params.q),
				callback : "onTranslated"
			}),
			d = $.Deferred(),
			newScript = document.createElement('script');

		$.get(url, function(res){
			_c.log(res);
		});
		// newScript.type = 'text/javascript';
		// newScript.src = url;
		// document.getElementsByTagName('head')[0].appendChild(newScript);

		return d.promise();
	}

	/*** returns
	type - object
	view - string
	url - string
	allowIframe - bool
	html_source - string
	meta - object
	title - string
	thumb - string
	ico - string
	*/ 
	this.parse = function(content, url){
		var $html = $.parseHTML(content),
			pl = $.url(url),
			rs = {},
			d = $.Deferred(),
			pattern,
			$holder = $("#dom-holder"),
			$holder = $("<div/>");

		var contains = function(subject, needles, strict){
			strict = strict || true;
			if($.type(needles) === "string")
				needles = [needles];

			if(strict){
				for(var i = 0; i<needles.length; i++)
					if(subject.indexOf(needles[i]) === -1) return false;
				return true;
			}else{
				for(var i = 0; i<needles.length; i++)
					if(subject.indexOf(needles[i]) !== -1) return true;
				return false;
			}
		}

		var sortByImageSize = function($img1, $img2){
			return ($img1.width() * $img1.height()) - $(img2.width() * $img2.height());
		}
		var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";

		//** init rs
		rs.type = {};
		rs.type.name = "default";
		rs.html_source = content;
		rs.view = "default";
		rs.url = url;

		//** get iframe policy
		rs.allowIframe = !contains(content, "X-Frame-Options");

		//** strip css and script tags
		for(var i = $html.length - 1; i>-1; i--){
			if($html[i].nodeName.toLowerCase() == "link[rel='stylesheet']" || $html[i].nodeName.toLowerCase() == "script")
				$html.splice(i, 1);
		}

		//** append to body
		$holder.append($html);

		//** traverse pre-defined regex to determine the type of the url
		for(i in urlTypes){
			pattern = new RegExp(urlTypes[i].match);
			if(pattern.test(url)){
				for(var j in urlTypes[i]){
					rs.type[j] = urlTypes[i][j];
				}
				rs.type.name = i;
			}
		}


		//** preserve meta tags
		rs.meta = {};
		$holder.find("meta[property], meta[name]").each(function(i, e){
			var name = $(this).attr("property") || $(this).attr("name");
			rs.meta[name] = $(e).attr("content");
		});

		//** get title
		rs.title = rs.meta["og:title"] || $holder.find("title").eq(0).html();
		//* get rid of html special characters
		rs.title = $("<div/>").html(rs.title).text();
		rs.thumb = rs.meta["og:image"];

		//** find ico
		//* use pre-defined ico url
		if(rs.type.ico){
			rs.ico = rs.type.ico;
		}else{

			//* look for ico from source
			//* get all link tag
			var $links = $holder.find("link[rel*='ico'][href]");
			var href,
				host = pl.attr("host");
				linkArr = [];
			var testLink=function(e){var t=e.attr("rel");if(t.split("-").length>1){return 0}if(t.indexOf("shortcut")!==-1&&t.indexOf("icon")!==-1){return 3}if(t.indexOf("shortcut")!==-1&&t.indexOf("ico")!==-1){return 2}if(t.indexOf("ico")!==-1||t.indexOf("icon")!==-1){return 1}}
			var sortByConfidence = function($a, $b){
				var score = function(rel){
					if(contains(rel, ["shortcut", "icon"])) return 3;
					if(contains(rel, ["shortcut", "ico"], false)) return 2;
					if(contains(rel, ["ico", "icon"], false)) return 1;
					if(contains(rel, ["-"])) return 0;
				}
				$a.score  = score($a.attr("rel"));
				$b.score  = score($b.attr("rel"));
				return $a.score - $b.score;
			}
			//** return true when e is absolute url
			var testAbs=function(e){if(e===undefined)return false;if(/^https?:\/\//i.test(e)||e.substr(0,2)==="//"){return true}return false}

			//** make a guess with given href
			var guess = function(href){
				var dir = pl.attr("directory");
				if(href === undefined)
					return  "http://" + host + "/favicon.ico";
				else
					return "http://" + host + dir + href;
			}

			$links.each(function(i, e){
				linkArr.push($(e));
			});
			linkArr = linkArr.sort(sortByConfidence);

			if(linkArr[0]){
				href = linkArr[0].attr("href");
			}

			//** is absolute url
			if(testAbs(href)){
				rs.ico = href;
			}else{
				//* is relative url
				//* is undefined
				//* example : img/favicon.ico
				if(href){
					if(href.substr(0,1) === "/")
						rs.ico = "http://" + host + href; //* relative to base
				}else{
					rs.ico = guess(href);
				}
			}
		}

		//** get customized data from each type
		var type = rs.type;
		var arr = type.name.split(".");
		switch(type.name){

			//* video view
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
				rs.meta1 = rs.meta;
				d.resolve(rs);
			break;
			case 'vimeo':
				rs.icon = type.ico;
				d.resolve(rs);
			break;
			case 'youku':
				rs.icon = type.ico;
				d.resolve(rs);
			break;
			case 'google.search' :
				var query = rs.type.selectors.results;
				var list = $(query);
				list = self.parseGoogleResult(list);
				rs.type.results = list.splice(0, 5);
				rs.view = "search";
				rs.title = rs.title.split(" - Goo")[0];
				rs.meta1 = rs.meta;
				rs.type.verb = "googled";
				d.resolve(rs);
			break;
			case 'google.translate':

				d.resolve(rs);
				/*
				var inputs = pl.attr("fragment").split("/"),
					params = {
						"source" : inputs[0],
						"target" : inputs[1],
						"q" : inputs[2]
					},
					api = 'https://www.googleapis.com/language/translate/v2?key={{clientId}}&source={{source}}&target={{target}}&callback={{callback}}&q={{q}}',
					url = utils.replace(api, {
						clientId : glob.apiKey,
						source : params.source,
						target : params.target,
						q : escape(params.q),
						callback : "onTranslated"
					}),
					d = $.Deferred(),
					newScript = document.createElement('script');

				//_c.log(url);
				newScript.src = url;
				document.getElementsByTagName('head')[0].appendChild(newScript);
				*/

				/*
				self.requestTranslate(params).then(function(translated){
					d.resolve(rs);
				});
				*/
				// var source = $holder.find("textarea#source").eq(0).val();
				// var result = $hcolder.find("span#result_box").eq(0).html();
				// rs.title = source + " : " + result;
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
				rs.gdocKey = rs.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
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
				rs.gdocKey = rs.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
				// console.log(rs.gdocKey);
				var request = gapi.client.drive.files.get({
				    'fileId': rs.gdocKey
				});
				request.execute(function(resp) {
					//_c.log(resp);
					rs.doc = {};
					rs.doc.presentation = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";
					d.resolve(rs);
				});
			break;
			default : 
				// _c.log(rs);
				d.resolve(rs);
			break;
		}
		//** dom query completed, remove dom
		$holder.html("");

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

.service("urlTypes", function(){
	return {
		"youtube" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(youtube\.com)\/.+$",
			ico : "http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png"
		},
		"youtube.watch" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$",
			ico : "http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png",
			embedUrl : "http://www.youtube.com/embed/{{VIDEO_ID}}?autoplay=1"
		},
		"vimeo" : {
			match : ".+(vimeo\.com)\/.+",
			ico : "http://a.vimeocdn.com/images_v6/favicon_32.ico",
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
		"google.search" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(google\.com.*)\/.+$",
			ico : "https://www.google.com.tw/favicon.ico",
			selectors : {
				results : "#rso li.g"
			}
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
		},
		"youku" : {
			match : ".+(youku\.com)\/.+",
			ico : "http://v.youku.com/favicon.ico"
		}
	};
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