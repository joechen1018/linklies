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
						apiParser.parse(res, url).then(function(obj, task){
							_d.resolve(obj, task);
						})
						.fail(function(){
							_d.reject();
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
			setLinkFolderId : function(id, folder_id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/setLinkFolderId/" + id + "/" + folder_id,
					method : "get",
					success : function(res){
						console.log(res);
						var link = apiParser.linkFromDb(res.data.Link);
						_d.resolve(link);
					}
				});
				return _d.promise();
			},
			saveLinkThumbs : function(urls, link_id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/saveLinkThumbs/",
					method : "post",
					data : {
						urls : urls,
						link_id : link_id
					},
					success : function(res){
						console.log(res);
						_d.resolve(res);
					}
				});
				return _d.promise();
			},
			saveField : function(field, value, id){
				console.log(field, value, id);
				var _d = $.Deferred();
				$.ajax({
					url : "api/saveField/link/" + id + "/" + field + "/" + value,
					method : "get",
					success : function(res){
						console.log(res);
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
			get : function(id, rel){
				var _d = $.Deferred();
				$.ajax({
					url : root + "api/fetchById/folder/" + id,
					method : "get",
					success : function(res){
						var obj = res.data.Folder;
						if(rel){
							_d.resolve(res);
							return;
						} 
						_d.resolve(obj);
					},
					fail : function(err){
						console.log(err);
					}
				});
				return _d.promise();
			},
			getLinks : function(folder_id){
				var _d = $.Deferred();
				$.ajax({
					url : root + "api/folderLinks/" + folder_id,
					method : "get",
					success : function(res){
						_d.resolve(res.data);
					},
					fail : function(err){
						console.log(err);
					}
				});
				return _d.promise();
			},
			create : function(user_id, grid){
				console.log(grid);
				var _d = $.Deferred();
				$.ajax({
					url : root + "api/createFolder/" + user_id + "/" + grid[0] + ',' + grid[1],
					method : "get",
					success : function(res){
						_d.resolve(res.data.Folder);
					},
					fail : function(err){
						console.log(err);
					}
				});
				return _d.promise();
			},
			save : function(folder){
				if(folder.grid){
					folder.grid = folder.grid.join(",");
				}

				//_c.log(folder);
				var _d = $.Deferred();
				$.ajax({
					url : "api/save/folder",
					method : "post",
					data : folder,
					success : function(res){
						var data = res.data.Folder;
						_d.resolve(data);
					}
				});
				return _d.promise();
			},
			saveName : function(id, name){
				var _d = $.Deferred();
				$.ajax({
					url : "api/saveFolderName/" + id + "/" + name,
					method : "get",
					success : function(res){
						_d.resolve(res);
					}
				});
				return _d.promise();
			},
			remove : function(id){
				var _d = $.Deferred();
				$.ajax({
					url : "api/removeFolder/" + id,
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
			var title = $(e).find("h3.r>a:first-child").text();
			var first_letter = title.charAt(0);
			var rest_letter = title.substr(1);
			rs.push({
				title : title,
				firstLetter : first_letter,
				restLetter : rest_letter,
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
		if(link.images !== undefined){
			obj.images = link.images.join(",");
		}

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

		if(typeof link.images === "string"){
			link.images = link.images.split(",");
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
			$holder = $("#dom-holder");

		var contains = function(subject, needles, strict){
			strict = strict === undefined ? true : false;
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
		var testImage = function(url){
			return /.jpg$|.jpeg$|.png$|.gif$/i.test(url);
		}
		var containedImgUrls, $containedImgs;
		var imgTest = /^(http:\/\/|https:\/\/|\/\/).*(.jpg|.png|.gif|.jpeg)($|\?.*|#.*)/i;
		var imgMatch = /(http:\/\/|https:\/\/|\/\/)[a-z0-9\/\.]*(.jpg|.png|.gif|.jpeg)/gi;
		//** timeout
		setTimeout(function(){
			if(!d.state !== "resolved") d.reject();
		}, 3500);

		//** init rs
		rs.type = {};
		rs.type.name = "default";
		rs.type.isImage = testImage(url);
		rs.html_source = content;
		rs.view = "default";
		rs.url = url;

		//** get iframe policy
		rs.allowIframe = !contains(content, "X-Frame-Options") && 
						(!rs.type.isImage) ;

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

		//** get all images
		var texts = $holder.html();
		var matchStr = texts.replace(/\n|\r/ig,"");
		var imgs = matchStr.match(/(http:\/\/|https:\/\/|\/\/)[a-z0-9\/\.]*(.jpg|.png|.gif|.jpeg)/gi);
		rs.imgs = imgs;
		rs.images = [];

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

		//** if url ends with file name like xxx.php, remove it
		var targetRoot = (function(url){
			var splits = url.split("/");
			if(splits[splits.length - 1].indexOf(".") !== -1){
				splits[splits.length - 1] = "";
			}
			return splits.join("/");
		})(rs.url);

		$holder.find("link, script, style, meta").remove();
		$containedImgs = $holder.find("img");

		var findValidThumbsTask = (function(link_id){

			var thumbs = [], $d = $.Deferred(), taskDuration = 6000;

			$containedImgs.each(function(i, e){

				(function($e){
					var src = $e.attr('src'),
						tmp;

					if(src.substr(0,7) ==="http://" || 
					   src.substr(0,8) === "https://" || 
					   src.substr(0, 2) === "//"){
					   	//** use src directly
					}else{
						src = targetRoot + src;

						//** double slash exists besides the one in http://
						tmp = src.split("://");
						if(tmp.length > 1){
							tmp[1] = tmp[1].replace(/\/\//g, "/");
							src = tmp.join("://");
						}
					}

					//** create and try load the image using src
					var $img = $("<img>");
					$img.attr("src", src);
					$("body").append($img);
					$img.css({
						position : "absolute",
						left : -10000
					});

					//** try load the image
					$img.load(function(){

						var w = $img.width(),
							h = $img.height(),
							ratio = w / h,
							src = $img.attr("src");

						//** as aquare as possible	
						if(ratio < 1.9 && ratio > 0.65){

							//** not too small
							if(w > 300 && h > 200){
								thumbs.push(src);
								//console.log(src, ratio);
							}
						}

						//** remove when done
						$img.remove();
					});

				})($(e));
			});

			setTimeout(function(){
				$d.resolve(thumbs, rs);
			}, taskDuration);

			return $d.promise();
		})(rs);

		//** get customized data from each type
		var type = rs.type;
		var arr = type.name.split(".");
		var matchRs;
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
				d.resolve(rs, findValidThumbsTask);
			break;
			case 'vimeo':
				rs.icon = type.ico;
				d.resolve(rs, findValidThumbsTask);
			break;
			case 'youku':
				rs.icon = type.ico;
				d.resolve(rs, findValidThumbsTask);
			break;
			case 'stackoverflow':
				var sel = rs.type.selectors;
				rs.type.qid = $holder.find("#question").attr("data-questionid");
				rs.type.q = $holder.find(sel.q).html();
				rs.type.qblock = "<pre class='theme-super'>" + $holder.find(sel.qblock).html() + "</pre>";
				rs.type.ablock = "<pre class='theme-super'>" + $holder.find(sel.ablock).html() + "</pre>";
				_c.log(rs.type);
				rs.view = "qa";
				d.resolve(rs, findValidThumbsTask);	
			break;
			case 'google.search' :
				var query = rs.type.selectors.results,
					list = $holder.find(query);

				list = self.parseGoogleResult(list);
				rs.title = rs.title.split(" - Goo")[0];
				rs.type.results = list.splice(0, 7);
				rs.type.verb = "googled";
				rs.type.q = rs.title;
				rs.view = "search";
				d.resolve(rs, findValidThumbsTask);

			break;
			case 'google.translate':

				d.resolve(rs, findValidThumbsTask);
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

				if(!rs.key){
					matchRs = rs.url.match(/^http.*docs.google.com\/spreadsheet\/.*key=(.*)\&|$/);
					if(matchRs !== null){
						if(matchRs.length > 1){
							rs.key = matchRs[1];
							if(rs.key == undefined){
								matchRs = rs.url.match(/.*docs\.google\.com\/spreadsheets\/d\/(.*)\/|$/);
								if(matchRs !== null){
									if(matchRs.length > 1){
										rs.key = matchRs[1];
									}
								}		
							}
						}
					}else{
						matchRs = rs.url.match(/.*docs\.google\.com\/spreadsheets\/d\/(.*)\/|$/);
						if(matchRs !== null){
							if(matchRs.length > 1){
								rs.key = matchRs[1];
							}
						}
					}
				}

				if(rs.key){
					var request = gapi.client.drive.files.get({
					    'fileId': rs.key
					});
					request.execute(function(resp) {
						_c.log(resp);
						rs.doc = {};
						rs.doc.spreadsheet = resp;
						rs.title = resp.title;
						rs.thumb = resp.thumbnailLink;
						d.resolve(rs, findValidThumbsTask);
					});
				}else{
					// _c.warn("no docs key found");
					d.resolve(rs, findValidThumbsTask);
				}
			break;
			case 'google.docs.document' : 
				rs.key = rs.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
				var request = gapi.client.drive.files.get({
				    'fileId': rs.key
				});
				request.execute(function(resp) {
					// _c.log(resp);
					rs.doc = {};
					rs.doc.document = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";
					// _c.log(rs);
					d.resolve(rs, findValidThumbsTask);
				    // console.log('Title: ' + resp.title);
				    // console.log('Description: ' + resp.description);
				    // console.log('MIME type: ' + resp.mimeType);
				});
			break;
			case "google.docs.presentations" :

				rs.key = rs.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/)[1];
				var request = gapi.client.drive.files.get({
				    'fileId': rs.key
				});
				request.execute(function(resp) {
					//_c.log(resp);
					rs.doc = {};
					rs.doc.presentation = resp;
					rs.title = resp.title;
					rs.thumb = resp.thumbnailLink;
					//rs.view = "doc";
					d.resolve(rs, findValidThumbsTask);
				});
			break;
			case 'google.docs.file' : 
				matchRs = rs.url.match(/.+d\/([a-zA-z0-9\-_]*)(\/|)(.+|)/);
				if(matchRs !== null){
					if(matchRs.length > 1){
						rs.key = matchRs[1];
					}
				}else{
					matchRs = rs.url.match(/.*\/d\/(.*)\/|$/);
					if(matchRs !== null){
						if(matchRs.length > 1){
							rs.key = matchRs[1];
						}
					}
				}
				if(rs.key){
					var request = gapi.client.drive.files.get({
					    'fileId': rs.key
					});
					request.execute(function(resp) {
						rs.doc = {};
						rs.doc.file = resp;
						rs.title = resp.title;
						rs.thumb = resp.thumbnailLink;
						if(resp.fileExtension === 'jpg' || resp.fileExtension === 'gif' || resp.fileExtension === 'png'){
							rs.type.isImage = true;
							rs.type.isGoogleImage = true;
						}
						//rs.view = "doc";
						// _c.log(rs);	
						d.resolve(rs, findValidThumbsTask);
					});
				}
			break;
			case 'google.maps' : 
				rs.title = "Latitude : " + rs.title.replace("(Untitled Location)", "")
												   .replace("- Google Maps", "")
												   .replace(",", ", ");
				d.resolve(rs);
			break;
			default : 
				if(rs.type.isImage){
					if(rs.title === ""){
						rs.title = rs.url;
						rs.thumb = rs.url;
					}
				}
				d.resolve(rs, findValidThumbsTask);
			break;
		}

		$holder.html("");
		delete $holder;	

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
		"stackoverflow" : {
			match : "^(http(s|)\:\/\/)?(www\.)?(stackoverflow\.com.*)\/.+$",
			ico : "http://cdn.sstatic.net/stackoverflow/img/favicon.ico",
			selectors : {
				q : "#question-header h1 a",
				qblock : "#question .post-text",
				ablock : ".answer.accepted-answer .post-text"
			}
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
		"google.docs.spreadsheet" : {
			match : "^http.*docs\.google\.com\/spreadsheet.*",
			ico : "https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png"
		},
		"google.docs.document" : {
			match : "^http.*docs\.google\.com\/document.*",
			ico : "https://ssl.gstatic.com/docs/documents/images/kix-favicon6.ico"
		},
		"google.docs.drawings" : {
			match : "^http.*docs\.google\.com\/drawings.*",
			ico : "https://ssl.gstatic.com/docs/drawings/images/favicon5.ico"
		},
		"google.docs.presentations" : {
			match : "^http.*docs\.google\.com\/presentations.*",
			ico : "https://ssl.gstatic.com/docs/presentations/images/favicon4.ico"
		},
		"google.docs.forms" : {
			match : "^http.*docs\.google\.com\/forms.*",
			ico : "https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_jfk2.png"
		},
		"google.docs.file" : {
			match : "^http.*docs\.google\.com\/file.*",
			ico : "https://ssl.gstatic.com/docs/doclist/images/icon_11_image_favicon.ico"
		},
		"google.maps" : {
			match : "^http.*maps\.google\.com.*",
			ico : "http://maps.gstatic.com/favicon3.ico"
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