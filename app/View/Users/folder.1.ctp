<div id="topbar">

	<!-- <div class="home">
		<span data-icon="r"></span>
	</div> -->
	<div class="funcs-1">
		<!-- <a class="addNew" href="" data-icon="d"><span></span></a> -->
		<a href="" class="options" data-icon="C"></a>
	</div>
</div>

<div class="folder-view-container" ng-controller="folderViewCtrl1">

	<ul class="list">
		<li class="link" ng-repeat="link in links">
			<div class="img-wrap">
				<!-- <img class="thumb" ng-repeat="img in link.images track by $index" ng-src="{{img}}" data-index="{{thumbIndex}}" class="{{iconHover ? 'icon-hover' : ''}}" > -->
				<img class="thumb" ng-src="{{link.images[link.thumbIndex]}}"  class="{{iconHover ? 'icon-hover' : ''}}" >
				<span class="thumb-icon" data-icon="j" ng-show="link.view == 'video'" ng-click="playVideo()"></span>	
				<div class="video-bg" ng-show="link.view == 'video'"></div>

				<!-- <div class="arrows" ng-show="link.images.length > 1">
					<div class="left" data-icon='"' ng-click="slideThumb(-1)"></div>
					<div class="right" data-icon='#' ng-click="slideThumb(1)"></div>
				</div> -->
			</div>
			<h1 class="title">{{link.title}}</h1>
			<p class="desc">{{link.description}}</p>
			
		</li>
	</ul>

</div>
