<div id="folder-{{data.id}}" class="folder {{data.FolderType.name}}" data-grid="{{data.grid}}" 
	data-grid-index="{{$index}}" 
	ng-style="getStyle()">
	<span class="icon" data-icon="{{data.FolderType.icon}}" ng-style="{
		top : (grids.folderSize.height  - 55  - 55) * 0.75
	}" ></span>
	<div class="close" data-icon="s"></div>
	<p class="name">{{data.name}}</p>
</div>

