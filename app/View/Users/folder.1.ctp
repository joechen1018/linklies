<div ng-controller="folderViewCtrl1">
	<div id="topbar">

		<!-- <div class="home">
			<span data-icon="r"></span>
		</div> -->
		<div class="funcs-1">
			<!-- <a class="addNew" href="" data-icon="d"><span></span></a> -->
			<a href="" class="options" data-icon="C"></a>
		</div>
	</div>

	<div class="folder-view-container">

		<ul class="list">
			<li class="link" ng-repeat="link in links">
				<div class="img-wrap"  ng-click="openLink(link)" ng-mouseenter="mouseEnter = true" ng-mouseout="mouseEnter = false">
					<!-- <img class="thumb" ng-repeat="img in link.images track by $index" ng-src="{{img}}" data-index="{{thumbIndex}}" class="{{iconHover ? 'icon-hover' : ''}}" > -->
					<img class="thumb" ng-src="{{link.images[link.thumbIndex]}}"  class="{{iconHover ? 'icon-hover' : ''}}" >

					<span class="thumb-icon" data-icon="j" ng-show="link.view == 'video'" ng-click="playVideo(link)"></span>	
					<div class="video-bg" ng-show="link.view == 'video'"></div>

					<!-- <div class="arrows" ng-show="link.images.length > 1">
						<div class="left" data-icon='"' ng-click="slideThumb(-1)"></div>
						<div class="right" data-icon='#' ng-click="slideThumb(1)"></div>
					</div> -->
				</div>
				<h1 bindonce bo-show="!link.allowIframe && link.view !== 'video'" class="title">
					<a target="_blank"  bindonce ng-mouseenter="link.mouseEnter = true" ng-mouseout="link.mouseEnter = false" bo-href="link.url">{{link.title}}</a>
				</h1>

				<h1  bindonce bo-show="link.allowIframe || link.view === 'video'" ng-click="openLink(link)" class="title">{{link.title}}</h1>

				<p class="desc">{{link.description | cut : true : 400 : '...'}}</p>

				<ul class="options">
					<li data-icon="g" ng-if="isOwner" title="edit"></li>
					<li data-icon="U" title="share"></li>
					<li data-icon="0" ng-if="isOwner" title="delete"></li>
					<li data-icon="@" class="open-in-tab" ng-class="{hover : link.mouseEnter === true && !link.allowIframe}" title="open in new tab"></li>
				</ul>
				
			</li>
		</ul>
		
		<div class="spacer"></div>
	</div>

	<div class="pop-layer" ng-controller="popupCtrl" ng-show="popupData.show">
		<div class="player-holder" ng-show="popupData.player.show">
			<iframe class="player" src="{{popupData.player.src}}" allowfullscreen width="100%" height="100%" frameborder="0"></iframe>
		</div>
		
		<div class="browser-holder"  ng-show="popupData.browser.show">
			<div iframe-browser></div>
		</div>

		<div class="bg" ng-click="closePopup()"></div>
	</div>
</div>