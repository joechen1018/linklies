<div class="link-popup" ng-controller="linkPopupCtrl">
	<div class="panel">
		<ul class="tabs">
			<li>edit</li>
			<li>share</li>
		</ul>
		<div class="edit">
			<input class="title" value="30個超荒謬但是每位養貓人士都一定要有的貓咪用品~~發明人應該是貓奴無誤!"></input>
			<div class="imgs">
				<img class="thumb selected" ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
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