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
		<div class="share">
			<p class="short-url">
				<span>goo.gl/4jyuub</span>
				<input type="checkbox" name="useShortenUrl" checked="checked">Use shorten url
			</p>
			<p class="clicks">
				<!-- <span class="click-count">5</span> clicks -->
			</p>

			<textarea class="say-something" placeholder="say something...."></textarea>
			<div class="img-wrap">
				<img class="thumb" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg"></img>
				<p class="title">30個超荒謬但是每位養貓人士都一定要有的貓咪用品~~發明人應該是貓奴無誤!</p>
				<p class="desc">
					有日本人以羊毛氈以及自製玻璃貓眼，手工製作了一隻又一隻超可愛的貓咪。製作者對貓的神態捕捉得淋漓盡致，
				</p>
			</div>
		</div>
		<div class="btns">
			<button class="ok">OK</button>
			<button class="cancel">Cancel</button>
		</div>
	</div>
	<div class="overlay"></div>
</div>