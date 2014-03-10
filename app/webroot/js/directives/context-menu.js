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
						"label" : "Pick",
						"icon" : "b",
						"options" : [
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
						]
					},
					{
						"name" : "upload",
						"label" : "Upload",
						"icon" : "b"
					},
					{
						"name" : "images",
						"label" : "Images",
						"icon" : ""
					},
					{
						"name" : "search",
						"label" : "Search",
						"icon" : "n",
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
							byName("upload"),
							byName("pick"),
							byName("search")
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

				/** display context menu
				$ele.css("left", newVal.left)
					.css("top", newVal.top);

				if(newVal.show){
					$ele.show();
				} 
				else{
					$ele.hide();
				}
				*/
			});

			scope.onItemClick= function($event, item){
				$ele.hide();
				if(item.name === "new"){

				}else{
					picker = createPicker(item.name, function(selection){
						//** callback
						_c.log(selection);
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

*/
