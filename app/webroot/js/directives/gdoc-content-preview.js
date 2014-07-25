app.directive("gdocContentPreview", function(gapiService){
	return {
		restrict : "EA",
		replace : true,
		scope: {
		    link : "=link"
		},
		link : function(scope, ele, attrs, ctrl){
			var link = scope.link;
			// console.log(link);
			if(link.type.name === "google.docs.file"){
				$(ele).on("error", function(){
					var key = link.key;
					var gapi = gapiService;

					gapi.loadApi().then(function(){
						gapi.loadDrive().then(function(){
							gapi.getDriveFile(key).then(function(file){
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