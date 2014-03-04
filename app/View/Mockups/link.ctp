<div class="link-details qa">
	<div class="arrow arrow-up" ng-show="true"></div>
	<div class="arrow arrow-down"></div>
	<div class="spacer"></div>

	<div class="funcs">
		<span data-icon="C" mg-show="data.allowIframe"></span>
		<span data-icon="p"></span>
		<span data-icon="H" ng-show="view === 'video'"></span>
	</div>

	<div class="detail-wrap {{data.view}}">

		<div class="close-btn" ng-hide>
			<span data-icon="q"></span>
		</div>
		
		<div class="texts" ng-hide>
			<h1>{{data.title}}</h1>
			<div class="more">
				<div class="arrow-right"></div>
				<a bo-href="data.url" target="_blank">Go To URL</a>	
			</div>
		</div>

		<div class="player-holder" ng-hide>
			<iframe style="display:none" src="" width="100%" height="100%" frameborder="0"></iframe>
		</div>
		
		<div class="img" ng-hide>
			<img class="thumb" class="{{iconHover ? 'icon-hover' : ''}}" bo-src="data.thumb">
			<span class="thumb-icon" data-icon="l" ng-show="data.view == 'video'" ng-click="playVideo()">
			</span>	
			<div class="video-bg" ng-show="data.view == 'video'"></div>
		</div>
			
		<ul class="search" ng-show="data.view == 'search'">
			<li bindonce ng-repeat="rs in data.type.results">
				<a bo-href="rs.href" bo-text="rs.title" target="_blank"></a>
				<span class="date" bo-text="rs.date"></span>
				<span data-icon="s" class="remove" ng-click="removeResult($index)"></span>
			</li>
		</ul>

		<div class="stackoverflow" ng-show="data.view == 'qa'" class="data.type.name">
			<h1>{{data.type.a}}</h1>
			<div class="q">
			</div>
			<div class="a">
			</div>
		</div>

	</div>
</div>