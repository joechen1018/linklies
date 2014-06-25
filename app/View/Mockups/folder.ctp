<!-- this is a copy of templates/folder.html, to be relocated -->
<div id="folder-{{data.id}}" 
ng-click="toggleOpen()"
class="folder {{data.FolderType.name}} closed" 
data-icon="{{data.FolderType.icon}}">

	<span class="link-count">{{linkList.count+1}}</span>
	<div class="close" data-icon="s"></div>
	<p class="name">{{data.name}}</p>
	<input id="edit-name" type="text" name="folderName" value="{{data.name}}" style="display:none" />
	<div ng-include="data.folderLinks"></div>

	<ul class="links-holder">
		<li ng-repeat="link in links" class="link" ng-style="{
			top : $index * 40
		}">
			<div class="state-ready">
				<div class="link-body">
					<p class="title">{{link.title}}</p>
				</div>
			</div>
		</li>
	</ul>
</div>

