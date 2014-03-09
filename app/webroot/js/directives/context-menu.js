app.directive("contextMenu", function(){
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
						"icon" : "c"
					},
					{
						"name" : "pick",
						"label" : "Pick...",
						"icon" : "b"
					},
					{
						"name" : "images",
						"label" : "Images...",
						"icon" : ""
					},
					{
						"name" : "images_videos",
						"label" : "Images & Videos...",
						"icon" : "",
						"options" : [
							{
								"name" : "DOCS_IMAGES_AND_VIDEOS",
								"label" : "Images/Videos",
								"icon" : ""
							},
							{
								"name" : "PHOTOS",
								"label" : "Photos",
								"icon" : ""
							}
						]
					},
					{
						"name" : "search",
						"label" : "Search...",
						"icon" : "n",
						"options" : [
							{
								"name" : "IMAGE_SEARCH",
								"label" : "Image Search",
								"icon" : ""
							},
							{
								"name" : "VIDEO_SEARCH",
								"label" : "Video Search",
								"icon" : ""
							}
						]
					},
					{
						"name" : "docs",
						"label" : "Docs...",
						"icon" : "R",
						"options" : [
							{
								"name" : "SPREADSHEETS",
								"label" : "Spreadsheet",
								"icon" : ""
							},
							{
								"name" : "DRAWINGS",
								"label" : "Drawings",
								"icon" : ""
							},
							{
								"name" : "DOCUMENTS",
								"label" : "Documents",
								"icon" : ""
							},
							{
								"name" : "PRESENTATIONS",
								"label" : "Presentations",
								"icon" : ""
							}
						]
					},
					{
						"name" : "delete",
						"label" : "Delete",
						"icon" : "L"
					},
					{	
						"name" : "new",
						"icon" : "d",
						"label" : "New",
						"options" : [
							{
								"name" : "folder",
								"label" : "Folder",
								"icon" : "a"
							},
							{
								"name" : "videoFolder",
								"label" : "Video Folder",
								"icon" : "l"
							},
							{
								"name" : "docFolder",
								"label" : "Doc Folder",
								"icon" : "R"
							},
							{
								"name" : "link",
								"label" : "Link",
								"icon" : "v"
							}
						]
					}
				],
				menuSets = [
					{
						"name" : "folder",
						"options" : [
							byName("openView"),
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
							byName("new"),
							byName("images_videos"),
							byName("search"),
							byName("docs")
						]
					}
				];
			$ele.hide();
			scope.$watch("context", function(newVal, oldVal){

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

				//** display context menu
				$ele.css("left", newVal.left)
					.css("top", newVal.top)
					.css("display", newVal.show ? "block" : "none");
			});

			scope.onItemClick= function(item){
				$ele.hide();
				switch(item.name){
					case 'pick' : 
						picker = createPicker([]);
					break;
					case 'search' : 

					break;
					case 'docs' :

					break;
				}
			}
			if(picker){
				picker.setVisible(true);
			}
		}
	}
});	