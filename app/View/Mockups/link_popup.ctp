<div class="link-popup" ng-controller="linkPopupCtrl">
	<div class="panel" ng-class="{
		share : !shared,
		shared : shared,
		edit : tab === 'edit'
	}">
		<ul class="tabs">
			<li ng-click="tab='edit'" ng-class="{selected : tab === 'edit'}">edit</li>
			<li ng-click="tab='share'" ng-class="{selected : tab === 'share'}">share</li>
		</ul>
		<div class="edit" ng-show="tab ==='edit'">
			<input type="text" class="title" value="個超荒謬但是每位養貓人士都一定要有的貓咪用品~~發明人應該是貓奴無誤!">
			<div class="imgs">
				<img class="thumb selected" ng-click="onImgClick($event)" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="https://i1.ytimg.com/vi/xR6Qait2JGY/maxresdefault.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="https://ytimg.googleusercontent.com/vi/JpUNwAdxBDw/hqdefault.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://assets.tumblr.com/images/default_avatar/pyramid_open_128.png">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://b.vimeocdn.com/ts/438/290/438290086_1280.jpg">
				<img class="thumb"  ng-click="onImgClick($event)" src="http://i1.ytimg.com/vi/rp9sYmnoFEU/maxresdefault.jpg">
				<div class="selected-border"></div>
				<div class="btn-del" ng-show="hoverImg !== false" ng-click="deleteHoverdImg()" data-icon="I" 
					></div>
			</div>
			<p class="img-count"><span class="count">7</span> images found</p>
		</div>
		<div class="share" ng-show="tab ==='share' && !shared">
			<p class="short-url">
				<span>goo.gl/4jyuub</span>
				<!-- <input type="checkbox" name="useShortenUrl" checked="checked">Use shorten url -->
			</p>
			<p class="clicks">
				<span class="click-count">5</span> clicks
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
		<div class="shared" ng-show="tab =='share' && shared">
			<p class="short-url">
				<span>goo.gl/4jyuub</span>
			</p>
			<p class="clicks">
				<span class="click-count">5</span> clicks
			</p>
			<p class="say-something">
				By so delight of showing neither believe he present. Deal sigh up in shew away when. Pursuit express no or prepare replied. Wholly formed old latter future but way she. Day her likewise smallest expenses judgment building man carriage gay. Considered introduced themselves mr to discretion at. Means among saw hopes for. Death mirth in oh learn he equal on. 
			</p>
			<div class="img-wrap">
				<img class="thumb" src="http://s1.gigacircle.com/media/s1_539a19432e1a3.jpg"></img>
				<p class="title">30個超荒謬但是每位養貓人士都一定要有的貓咪用品~~發明人應該是貓奴無誤!</p>
				<p class="desc">
					有日本人以羊毛氈以及自製玻璃貓眼，手工製作了一隻又一隻超可愛的貓咪。製作者對貓的神態捕捉得淋漓盡致，
				</p>
			</div>
		</div>
		<div class="btns">
			<button class="share" ng-show="tab ==='share'">Share</button>
			<button class="close">Close</button>
		</div>
	</div>
	<div class="overlay"></div>
</div>