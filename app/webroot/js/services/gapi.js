app.service("gapiService", function(){

	var clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com",
		scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/urlshortener',
		token,
		secret = "zo03y8aW30ZAJnJLKYSH4b4v",
		userId,
		self = this,
		$dr_ready = $.Deferred();

	//** to be removed...
	var authorize = function(rs){

		//** successfully authorized
		if (rs && !rs.error && rs["access_token"]) {

			//* save to cookie
			token = rs["access_token"];
			$.cookie("user.token", token);

			//* for some google bug the api key needs to be reset to nothing
			gapi.client.setApiKey("");

			//* load google plus
		    gapi.client.load('plus', 'v1', function() {
		        var request = gapi.client.plus.people.get({
		            'userId': 'me'
		        });
		        request.execute(function(resp) {

		        	//*** user must be a google plus user
		        	//* post plus user data to login
		        	if(resp.isPlusUser){
		        		$.ajax({
			        		url : "login",
			        		method : "post",
			        		data : resp,
			        		success : function(res){

			        			//* save user data to sessionStorage
			        			if(typeof sessionStorage !== undefined){
			        				sessionStorage.setItem("userData", JSON.stringify(res));
			        			}

			        			//* redirect user to desktop view
			        			var user = res.data.User;
			        			if(user && user.username_id){
			        				location.href = root + user.username_id
			        				return;
			        			}
			        		},
			        		error : function(){
			        			//** handle errors here
			        		}
			        	});
		        	}else{
		        		alert("You need to be a Google+ user to continue");
		        		location.href = "https://plus.google.com/";
		        	}
		         });
		    });

		} else {
			//** authorization failed
		}
	}

	//** get google client.js
	var getClientJs = function(){
		(function() {
		    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		    po.src = 'https://apis.google.com/js/client.js?onload=onGapiLoaded';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();
	}

	//** google api loaded
	this.apiLoaded = false;

	//** check authentication
	this.checkAuth = function(){
		var $dr = $.Deferred();
		gapi.auth.authorize({
			client_id: clientId, 
			scope: scopes, 
			immediate: false
		}, function(rs){
			if(rs){
				self.token = rs.token;
				return $dr.resolve(rs);
			}
			dr.reject();
		});
		return $dr.promise();
	}
	this.loadPlus = function(){
		var $dr = $.Deferred();
		gapi.client.setApiKey("");
	    gapi.client.load('plus', 'v1', function() {
	    	if(gapi.client.plus){
				var request = gapi.client.plus.people.get({
		            'userId': 'me'
		        });
		        request.execute(function(rs) {
		        	 $dr.resolve(rs)
		        });
			}else{
				$dr.reject();
			}
	    });
		return $dr.promise();
	}

	var driveReady = false;
	this.loadDrive = function(fileKey){
		var $dr = $.Deferred();
		if(driveReady){
			$dr.resolve();
		}
		gapi.client.setApiKey("");
		gapi.client.load("drive", "v2", function(data){
			driveReady = true;
			$dr.resolve();
	    });
		return $dr.promise();
	}

	this.getDriveFile = function(key){
		var $dr = $.Deferred();
		var key = key ? key : 'root';
		var request = gapi.client.drive.files.get({
        	'fileId': key
    	});
        request.execute(function(rs) {
            $dr.resolve(rs)
        });
        return $dr.promise();
	}

	this.loadShortenUrl = function(url){
		var $dr = $.Deferred();
		gapi.client.setApiKey("");
		gapi.client.load("urlshortener", "v1", function(data){
        	 var request = gapi.client.urlshortener.url.insert({
	            'resource': {
			      'longUrl': url
			    }
	        });
	        request.execute(function(rs) {
	        	//** rs.id is short url
	        	if(rs.id != null){
	        	 	$dr.resolve(rs)
	        	}else{
	        		$dr.reject(rs);
	        	}
	        });
	    });
		return $dr.promise();
	}

	this.check = function(){
		var $dr = $.Deferred();
		if(!this.ready){
			$dr.reject();
		}else{
			if(gapi){
				gapi.auth.authorize({
					client_id: clientId, 
					scope: scopes, 
					immediate: false
				}, function(rs){
					if(rs && !rs.error && rs["access_token"]){
						$dr.resolve(rs);
					}else{
						$dr.reject(rs);
					}
				});
			}else{
				$dr.reject();
			}
		}
		return $dr.promise();
	}

	this.loadApi = function(){
		if(this.apiLoaded){
			$dr_ready.resolve();
		}
		return $dr_ready.promise();
	}

	getClientJs();
	window.onGapiLoaded = function(){
		gapi.client.setApiKey(clientId);
		self.apiLoaded = true;
		$dr_ready.resolve();
	}
});