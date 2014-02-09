app.service("apiService", function($http, contentParser){
	return {
		linkService : {
			create : function(url){
				//url = "http://www.youtube.com/watch?v=eWnHL-M8g3g ";
				//select * from geo.places where text="sunnyvale, ca"

				// url = "http://www.books.com.tw/books/new/79newbooks.php";
				// url = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text="sunnyvale, ca"&format=json&callback=yqlcallback';
				// var yql = encodeURI(url);
		
				/*var yql = 'select * from html where url = "' + encodeURI(url) + '"';
				var req = 'http://query.yahooapis.com/v1/public/yql?q=' + yql;
				console.log(req);
				$.ajax({
					method : "get",
					url : req,
					success : function(data){
						console.log(data);
					},
					error : function(e){
						console.debug(e);
					}
				});*/
				var _d = $.Deferred();
				$.ajax({
					url : "api/getUrlHtml/",
					method : "post",
					data : {"url" : url},
					success : function(res){
						obj = contentParser.parse(res, url);
						//console.log(obj);
						_d.resolve(obj);
					},
					fail : function(err){
						console.log(err);
					}
				});
				
				/*//var graber = "http://whateverorigin.org/";
				var graber = "http://anyorigin.com/";
				$.getJSON(graber + 'get?url=' + encodeURIComponent(url) + '&callback=?').done(function(data){
					obj = contentParser.parse(data.contents, url);
					_d.resolve(obj);
				});*/
				return _d.promise();
			},
			save : function(link){
				var _d = $.Deferred();
				$.ajax({
					url : "api/saveLink",
					method : "post",
					data : link,
					success : function(res){
						//console.log(res);
						_d.resolve(res);
					}
				});
				return _d.promise();
			},
			remove : function(id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/removeLink/" + id,
					method : "get",
					success : function(res){
						_d.resolve(res);
					}
				});
				return _d.promise();
			}
		},
		getFolders : function(){

			return $http.get("json/folders1.json").then(function(rs){
				return rs.data;
			})
		},
		getLinks : function(){
			/*var links = [];
			for(var i = 0; i<4; i++){
				links.push({
					id : "link-" + (i+1),
					grid : [0, 4+i],
					ico : "http://www.youtube.com/favicon.ico",
					url : "site.com",
					site : "www.youtube.com",
					state : {
						name : "ready",
						focus : false
					},
					LinkPage : [{
						title : "",
						thumb : "",
						desc : ""
					}]
				});
			}

			links[3].state.name = "loading";
			links[3].state.focus = true;
			links[3].url = "http://www.youtube.com/watch?v=IUjWumGIqe8&list=RDwnpVWvCDINU";*/
			var url = $.url();
			var path = url.attr("path").split("/");
			var user_id = path[path.length - 1];
			var _d = $.Deferred();
			$.ajax({
				url : "api/getLinks/" + user_id,
				method : "GET",
				success : function(data){
					//_c.log(data);
					var links = data.links;
					for(var i = 0; i<links.length; i++){
						links[i].state = {
							name : "ready"
						}
					}
					return _d.resolve(links);
				},
				error : function(data){
					_c.error(data);
					//location.href = root + "users/login";
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
			ico : "http://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png"
		},
		"google" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(google\.com)\/.+$",
			ico : "https://www.google.com.tw/favicon.ico"
		},
		"tw.google" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(google\.com\.tw)\/.+$",
			ico : "https://www.google.com.tw/favicon.ico"
		},
		"google.drive" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(drive\.google\.com)\/.+$",
			ico : "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_4.ico"
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
		rs.type = "default";
		rs.types = [];

		//append dom
		var holder = $("#dom-holder");
		var $html = $.parseHTML(content);
		holder.html("");
		holder.append($html);

		url = url.replace("https", "http");

		var type;
		var pattern;
		for(var i in contentTypes){
			pattern = new RegExp(contentTypes[i].match);
			if(pattern.test(url)){
				rs.type = {};
				rs.type.name = i;
				rs.type.ico = contentTypes[i].ico || "";
			}
		}


		//find meta
		rs.meta = {};
		holder.find("meta[property], meta[name]").each(function(i, e){
			var name = $(this).attr("property") || $(this).attr("name");
			rs.meta[name] = $(e).attr("content");
		});

		var purl = $.url(url);
		rs.meta.url = {
			'source' : url,
			'protocol' : purl.attr("protocol"),
			'host' : purl.attr("host"),
			'port' : purl.attr("port"),
			'relative' : purl.attr("relative"),
			'path' : purl.attr("path"),
			'directory' : purl.attr("directory"),
			'file' : purl.attr("file"),
			'query' : purl.attr("query"),
			'fragment' : purl.attr("fragment")
		};
		rs.url = purl;

		//find title
		rs.title = holder.find("title").eq(0).html();
		//find ico

		if(rs.type.ico){
			rs.ico = rs.type.ico;
		}else{

			var links = holder.find("link[rel*='ico'][href]");
			var href;
			var testLink = function($e){
				var rels = $e.attr("rel");

				if(rels.split("-").length > 1){
					return 0;
				}
				if(rels.indexOf("shortcut") !== -1 && rels.indexOf("icon") !== -1){
					return 3;
				}
				if(rels.indexOf("shortcut") !== -1 && rels.indexOf("ico") !== -1){
					return 2;
				}
				if(rels.indexOf("ico") !== -1 || rels.indexOf("icon") !== -1){
					return 1;
				}

			}
			var scores = [];
			links.each(function(i, e){
				scores.push({
					score : testLink($(e)),
					href : $(e).attr("href")
				});
			});
			var max = _.max(scores, function(score){
				return score.score;
			});
			var maxIndex = _.indexOf(scores, max);
			href = max.href;
			//console.log(href);

			var testA = function(href){
				if(href === undefined) return false;
				if(/^https?:\/\//i.test(href) || href.substr(0,2) === "//"){
					return true;
				}
				return false;
			}
			//absolute url
			if(testA(href)){
				rs.ico = href;
			}else{
				// relative url
				// example img/favicon.ico
				var makeGuess = function(href){
					//relative to current
					var host = rs.meta.url.host;
					var dir = rs.meta.url.directory;
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
					rs.ico = "http://" + rs.meta.url.host + href;
				}else{
					makeGuess(href);
				}
			}
		}
		//console.log(rs.ico);

		//get typed data
		rs.typed = {};
		//console.log(rs.type.name);
		switch(rs.type.name){
			case 'youtube.watch' :
				rs.typed.videoId = url.split("v=")[1].split("&")[0];
			break;
			case 'google.docs.spreadsheet' : 
				rs.gdocKey = rs.url.param("key");
				var request = gapi.client.drive.files.get({
				    'fileId': rs.gdocKey
				});
				request.execute(function(resp) {
					_c.log(resp);
				    // console.log('Title: ' + resp.title);
				    // console.log('Description: ' + resp.description);
				    // console.log('MIME type: ' + resp.mimeType);
				});
				_c.log(rs);
			break;
		}

		//remove dom
		holder.html("");
		return rs;

	}
})


