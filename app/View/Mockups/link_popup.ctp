<div class="link-popup" ng-controller="linkPopupCtrl">
	<div class="panel">
		<ul class="tabs">
			<li class="selected">edit</li>
			<li>share</li>
		</ul>
		<div class="edit">
			<textarea class="title">個超荒謬但是每位養貓人士都一定要有的貓咪用品~~發明人應該是貓奴無誤!"></textarea>
			<div class="imgs">
				<img class="thumb selected" ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="https://i1.ytimg.com/vi/xR6Qait2JGY/maxresdefault.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="https://ytimg.googleusercontent.com/vi/JpUNwAdxBDw/hqdefault.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://assets.tumblr.com/images/default_avatar/pyramid_open_128.png">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://b.vimeocdn.com/ts/438/290/438290086_1280.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://i1.ytimg.com/vi/rp9sYmnoFEU/maxresdefault.jpg">
				<div class="selected-border"></div>
			</div>
			<p class="img-count"><span class="count">7</span> images found</p>
		</div>
		<div class="share"></div>
		<div class="btns">
			<button class="ok">OK</button>
			<button class="cancel">Cancel</button>
		</div>
	</div>
	<div class="overlay"></div>
</div>