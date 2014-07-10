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
				<img ng-src="{{link.images[link.thumbIndex]}}" alt="">
			</div>
			<h1 class="title">{{link.title}}</h1>
			<p class="desc">{{link.description}}</p>
		</li>
	</ul>

</div>
