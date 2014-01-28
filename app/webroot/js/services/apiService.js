app.service("apiService", function($http){
	return {
		getFolders : function(){

			return $http.get("json/folders.json").then(function(rs){
				return rs.data;
			})
		},
		getLinks : function(){
			var links = [];
			for(var i = 0; i<4; i++){
				links.push({
					id : "link-" + (i+1),
					grid : [0, 4+i],
					url : "site.com",
					pageTitle : "Nina Simone - Feeling good (Nicolas Jaar edit) \"Nico's feeling Good\" - YouTube",
					thumb : "https://fbexternal-a.akamaihd.net/safe_image.php?d=AQBdfgUT1fJTToGl&w=398&h=208&url=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FBkzvSf9NLTY%2Fhqdefault.jpg&cfs=1&upscale",
					contentTitle : "Nicolas Jaar - Sonar 2012 (full set)",
					from : "www.youtube.com",
					desc : "THIS IS THE FIRST 11 MINUTES OF THE DARKSIDE ALBUM. FOOTAGE WAS FILMED IN MONTICELLO, NY. RECORD WAS WRITTEN AND RECORDED AT OTHER PEOPLE STUDIOS, NY, STUDIO DE LA REINE, PARIS & THE BARN, GARRISON, NY.",
					state : {
						name : "ready",
						focus : false
					}
				});
			}

			links[3].state.name = "paste-url";
			links[3].state.focus = true;
			return links;
			return $http.get("json/folder.json").then(function(rs){

			});
		}
	}
});