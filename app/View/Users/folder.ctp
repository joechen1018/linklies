<div id="topbar"></div>
<ul id="links-container">
	<li ng-repeat="link in links" class="link" data-i="{{$index}}, {{index}}" ng-class="{
		current : $index === index, 
		prev : $index === index-1, 
		next : $index === index+1
	}" data-text="{{link.allowIframe}}">
		<div class="iframe-wrap">
			<iframe src="" frameborder="0"></iframe>
		</div>
		<div class="no-iframe">
			<h1>Can not be displayed. 
				<a href="{{link.url}}" target="_blank">Go to URL</a>
			</h1>
		</div>
		<div class="hover-overlay">
			
		</div>
	</li>
</ul>