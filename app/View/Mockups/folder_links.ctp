<div id="link-list">
	<div class="arrow arrow-left"></div>
	<p><a href="{{folderUrl}}">Open in new tab</a></p>
	<ul>
		<li ng-repeat="link in linkList">
			<img src="{{link.ico}}" alt="">
			<a href="{{link.url}}" target="_blank">{{link.title}}</a>
		</li>
	</ul>
</div>