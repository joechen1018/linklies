<div id="topbar"></div>
<ul id="links-container">
	<li ng-repeat="link in links" class="link" data-i="{{$index}}, {{index}}" ng-class="{
		current : $index === index, 
		prev : $index === index-1, 
		next : $index === index+1,
		video : link.view === 'video',
		img : link.type.isImage === true,
		gimg : link.type.isGoogleImage,
		useIframe : link.allowIframe && !(link.type.isImage || link.view === 'video'),
		noIframe : !(link.allowIframe && !(link.type.isImage || link.view === 'video'))
	}" data-text="{{link.allowIframe}}">
		<div class="iframe-wrap">
			<ul class="options" >
				<li class="full-screen" ng-click="goFullScreen()" data-icon="d"></li>
				<li class="back-from-full-screen" ng-click="goBackFullScreen()" data-icon=")"></li>
				<li class="refresh" data-icon="J" ng-click="refreshIframe()"></li>
				<!-- li.comments icon="E00D" -->
			</ul>
			<iframe id="frame-{{$index}}" sandbox="allow-forms allow-scripts allow-same-origin" src="" frameborder="0"></iframe>
		</div>
		<div class="img-view">
			<img ng-src="{{link.imageUrl}}" alt="" class="img img-{{$index}}">
		</div>
		<div class="video-view">
			<iframe src="" width="100%" height="100%" frameborder="0"></iframe>
		</div>
		<div class="config">
			
		</div>
		<div class="no-iframe">
			<div class="logo-wrap">
				<?php echo $this -> Html -> image("logo-1.png", array("width" => 64, "height" => 64)); ?>
			</div>
			<!-- data-icon="*" -->
			<h1>
				Not allowed to display here, please go to the original page <br/>
				<a href="{{link.url}}" target="_blank"><span class="title">{{link.title}}</span><span class="icon" data-icon="x"> </span></a>
				<div class="img-holder" ng-show="link.thumb != ''">
					<img src="{{link.thumb}}" alt="">
				</div>
			</h1>
			<!-- <div class="qr-holder">
				<img src="https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl={{link.url}}" alt="">
				<p class="shorten-url" ng-if="link.short_url.length > 5">
				</p>
			</div> -->
		</div>
		<div class="hover-overlay">
			
		</div>
	</li>
</ul>

<div id="arrows">
	<div class="left" data-icon="6" style="display:{{showNavLeft ?'block' : 'none'}}"></div>
	<div class="right" data-icon="7"  style="display:{{showNavRight ?'block' : 'none'}}"></div>
</div>

<div id="paginator" ng-show="showPaginator">
	<p>
		<span class="ico-wrap">
			<img class="ico" src="{{links[index].ico}}" alt="">	
		</span>
		<span class="title">{{links[index].title}}</span>

		<div class="page">
			<span class="current">{{index + 1}}</span>
			<span>/</span>
			<span class="total">{{links.length}}</span>
		</div>
		<!-- <ul class="page-bar">
			<li ng-repeat="link in links" ng-class="{on : index === $index }"></li>
		</ul> -->
	</p>
</div>