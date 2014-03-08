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
						"name" : "upload",
						"label" : "Upload",
						"icon" : "b"
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
							byName("upload")
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

				_c.log(scope.context);

				//** display context menu
				$ele.css("left", newVal.left)
					.css("top", newVal.top)
					.css("display", newVal.show ? "block" : "none");
			});
		}
	}
});	