app.directive("contextMenu", function(uuid, apiService, apiParser, $rootScope, urlTypes){
	return {
		restrict : "EA",
		templateUrl : "templates/context-menu.html",
		controller : function($scope){

		},
		replace : true,
		scope: {
		    context : "=contextMenuData"
		},
		link : function(scope, ele, attrs, ctrl){

			var byName = function(name){
				for(var i = 0; i<menuItems.length; i++){
					if(menuItems[i].name === name){
						return menuItems[i];
					}
				}
				return false;
			}
			var $ele = $(ele),
				menuItems = [
					{
						"name" : "openView",
						"label" : "Folder View",
						"icon" : "Q"
					},
					{
						"name" : "rename",
						"label" : "Rename",
						"icon" : "g"
					},
					{
						"name" : "pick",
						"label" : "Google Drive",
						"icon" : "P",
						"options" : []
					},
					{
						"name" : "map",
						"label" : "Location",
						"icon" : "w",
						"options" : []
					},
					{
						"name" : "upload",
						"label" : "Upload File",
						"icon" : "}"
					},
					{
						"name" : "images",
						"label" : "Images",
						"icon" : "~"
					},
					{
						"name" : "search",
						"label" : "Search",
						"icon" : "B",
					},
					{
						"name" : "delete",
						"label" : "Delete",
						"icon" : "0"
					},
					{	
						"name" : "new",
						"icon" : "s",
						"label" : "New",
						"options" : [
							{
								"name" : "new.folder",
								"label" : "Folder",
								"icon" : "Q"
							},
							{
								"name" : "new.videoFolder",
								"label" : "Video Folder",
								"icon" : "j"
							},
							{
								"name" : "new.link",
								"label" : "Link",
								"icon" : "H"
							}
						]
					}
				],
				menuSets = [
					{
						"name" : "folder",
						"options" : [
							byName("openView"),
							byName("rename"),
							byName("delete")
						]
					},
					{
						"name" : "link",
						"options" : []
					},
					{
						"name" : "board",
						"options" : [
							byName("pick"),
							byName("upload"),
							byName("search"),
							byName("map"),
							byName("new")
						]
					}
				];
			$ele.hide();
			scope.$watch("context", function(newVal, oldVal){

				var $menu;
				var showFolderOptions = function(){
					//** wait for dom finish drawing
					setTimeout(function(){
						$menu = $(".context-menu").eq(0);
						$menu.find("li").not(":has(ul)").each(function(i, e){
							var text = $(e).text().trim();
							if(/.*folder.*/i.test(text)){
								$(e).show();
							}
						});
					}, 20);
				}
				var hideFolderOptions = function(){
					//** wait for dom finish drawing
					setTimeout(function(){
						$menu = $(".context-menu").eq(0);
						$menu.find("li").not(":has(ul)").each(function(i, e){
							var text = $(e).text().trim();
							if(/.*folder.*/i.test(text)){
								$(e).hide();
							}
						});
					},20);
				}
				if(newVal){
					//** init obj has no name. link currently has no context menu
					if(newVal["class"] == "link" || newVal["class"] == "") return;

					//** get set by target name
					scope.context.set = (function(){
						for(var i in menuSets){
							if(menuSets[i].name === newVal["class"]){
								return menuSets[i];
							}
						}
						return menuSets[2]
					})();

					if(newVal.folderAvailable === true){
						showFolderOptions();
					}else{
						hideFolderOptions();
					}
				}
			});

			scope.onItemClick= function($event, item){
				$ele.hide();
				if(item.name.indexOf("new.") !== -1){

					var ctrl = scope.$parent;
					switch(item.name){
						case 'new.link' :
							ctrl.onBoardDbClick(false, scope.context.grid);
						break;
					}

				}else{
					picker = createPicker(item.name, function(rs){
						//** callback doesn't just get called on finish selecting
						//console.log(rs);
						if(rs.action === "picked"){

							var item = rs.docs[0],
								title = item.name,
								url = item.url,
								grid = scope.context.grid,
								linkService = apiService.linkService,
								ctrl = scope.$parent;

							var newLink = {
								title : title,
								grid : grid,
								uuid : uuid.create(),
								username_id : glob.user.username_id,
								user_id : glob.user.id,
								url : url,
								key : item.id,
								state : {
									name : "loading",
									focus : true
								}
							};

							//** maps returns 'Untitled Location'
							if(item.serviceId === "maps"){
								newLink.title = "Location : " + item.latitude + " , " + item.longitude;
								newLink.thumb = item.thumbnails[item.thumbnails.length - 1].url;
							}

							//** get the larger thumb
							if(typeof item.thumbnails === "object"){
								if(item.thumbnails.length === 1)
									newLink.thumb = item.thumbnails[0].url;
								else if(item.thumbnails.length === 2)
									newLink.thumb = item.thumbnails[1].url;
							}

							//** color animation 
							startColorShifting($(".link").last().find(".state-loading .no-icon"));

							_c.log(item);
							_c.log(newLink);
							ctrl.links.push(newLink);
							linkService.create(url).then(function(data){
								// _c.log(data);
								//** use new data but keep a copy of the old
								var odata = newLink;

								//** attribute that we will use from old
								var list = ["dragging", "grid", "url", "user_id", "username_id", "uuid", "title", "key", "state"];
								if(item.serviceId === "maps"){
									list.push("thumb");
								}
								for(var i in odata){
									for(var j = 0; j<list.length; j++){
										if(i == list[j]){
											data[i] = odata[list[j]];
										}
									}
								}
								//** parse from string to object etc
								data = apiParser.linkFromDb(data);
								//** stop color animation
								stopColorShifting();

								//** update view	
								ctrl.$apply(function(){
									ctrl.links[ctrl.links.length - 1] = data;
								});

								_c.log(data);
								linkService.save(data).then(function(rs){
									_c.log(rs);
									data.id = rs.id;
									$rootScope.$broadcast("linkCreationComplete", data);
								});
							});
						}
					});
					picker.setVisible(true);
				}
				$event.stopPropagation();
			}
		}
	}
});	


/*

pick - docs
	 - images
	 - videos
	 - files

search - images
	   - videos

upload - files

webcam



"name" : "docFolder",
"label" : "Doc Folder",
"icon" : "R"


{
	"name" : "pick.docs",
	"label" : "Google Doc",
	"icon" : ""
},
{
	"name" : "pick.videos",
	"label" : "Videos",
	"icon" : ""
},
{
	"name" : "pick.images",
	"label" : "Images",
	"icon" : ""
},
{
	"name" : "pick.files",
	"label" : "Files",
	"icon" : ""
}

*/
