<div id="topbar"></div>
<ul id="links-container">
	<li ng-repeat="link in links" class="link" data-i="{{$index}}, {{index}}" ng-class="{
		current : $index === index, 
		prev : $index === index-1, 
		next : $index === index+1
	}" data-text="{{link.allowIframe}}">
		<div class="iframe-wrap">
			<ul class="options">
				<li class="full-screen" data-icon="^"></li>
			</ul>
			<iframe id="frame-{{$index}}" src="" frameborder="0"></iframe>
		</div>
		<div class="no-iframe">
			<div class="logo-wrap">
				<?php echo $this -> Html -> image("logo-1.png", array("width" => 64, "height" => 64)); ?>
			</div>
			<h1 data-icon="*">Unable to display 
				<a href="{{link.url}}" target="_blank"><span class="title">{{link.title}}</span><span class="icon" data-icon="x"> </span></a>
				<div class="img-holder" ng-show="link.thumb != ''">
					<img src="{{link.thumb}}" alt="">
				</div>
			</h1>
			<div class="qr-holder">
				<img src="https://chart.googleapis.com/chart?cht=qr&chs=100x100&chl={{link.url}}" alt="">
				<p class="shorten-url" ng-if="link.short_url.length > 5">
					<span>share with this shorten url</span><br/>
					<span class="url">
						{{link.short_url}}
					</span>
				</p>
			</div>
		</div>
		<div class="hover-overlay">
			
		</div>
	</li>
</ul>