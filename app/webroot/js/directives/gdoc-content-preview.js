app.directive("gdocContentPreview", function(gapiService){
	return {
		restrict : "EA",
		replace : true,
		scope: {
		    link : "=link"
		},
		link : function(scope, ele, attrs, ctrl){
			var link = scope.link;
			console.log(attrs.src);
			if(link.type.name === "google.docs.file"){
				$(ele).on("error", function(){
					var key = "0BzJy4AXy73o_cTZoUDdLdlQwems";
					var gapi = gapiService;

					gapi.loadApi().then(function(){
						gapi.loadDrive().then(function(){
							gapi.getDriveFile(key).then(function(file){
								console.log(file);
								if(file){
									if(file.result){
										$(ele).attr("src", file.result.thumbnailLink);
									}
								}
							});
						});
					});
				});
			}
		}
	}	
});