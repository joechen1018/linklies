<div id="link-list" ng-show="linkList.show">
	<div class="holder">
		<div class="arrow arrow-left"></div>
		<p><a data-icon="x" href="{{folderUrl}}">Folder View</a></p>
		<ul>
			<li ng-repeat="link in linkList.content">
				<img src="{{link.ico}}" alt="">
				<a href="{{link.url}}" target="_blank">{{link.title}}</a>
				<i data-icon="x"></i>
				<div data-icon="v">
					<ul>
						<li data-icon="I">
							<a href="">delete</a>
						</li>	
					</ul>
				</ul>
			</li>
		</ul>	
	</div>
</div>