<?php $h = $this -> Html; ?>
<!-- <div id="topBar">
		<a class="save" href="javascript:saveBoard()">Save</a>
		<a class="clear" href="javascript:clearBoard()">Clear</a>
</div> -->

<!-- <div id="dev-view" ng-controller="devCtrl">
	<h1>{{obj.a}} + {{obj.b}} = {{result}}</h1>
	<a href="#" ng-click="onclick">click</a>
</div> -->
<div id="overlay-layer" ng-show="showOverlay">
	<div id="signIn" ng-show="requireSign">
		<a href="" data-icon3="r"  id="authorize-button" style="visibility: hidden"><span>Sign In With Google</span></a>
	</div>
	<div class="bg"></div>
</div>


<div id="desktop-view" ng-controller="desktopCtrl" ng-style="getDesktopStyle()">
		
	<div id="dom-holder"></div>	
	<!-- Antique Photo Theme -->
	<!-- <ul id="color-theme">
		<li style="background:#518C7C">
			
		</li>
		<li style="background:#C6D9B4"></li>
		<li style="background:#EDF2C4"></li>
		<li style="background:#A6986D"></li>
	</ul> -->
	<!-- grid lines -->

	<!-- <h1 class="links-left">98 <span>left</span></h1> -->

	<!-- <div id="topbar">
		<div class="funcs">
			<?php //include("img/icons-2/general/SVG/add25.svg") ?>	
		</div>
	</div> -->
	<div id="msg-box">
		<div class="arrow-up"></div>
		<p class="msg-body">Hello Linklies!</p>
	</div>

	<div id="topbar">

		<div class="bg-left" ng-style="{
			width : grids.defaults.sideWidth + 2.0 * grids.gridFullWidth
		}">
			
		</div>
		<!-- <p><span data-icon="g" class="icon"></span><span class="logo">LiNKlies</span></p> -->
		<div class="search" ng-style="{width : grids.gridFullWidth * 1.5}">
			<input type="text" placeholder="enter keywords" ng-style="{
				width : grids.gridFullWidth * 1.5
			}">
			<span data-icon="n" ></span>
		</div>
		<!-- <div class="home">
			<span data-icon="r"></span>
		</div> -->
		<div class="funcs-1">
			<a class="addNew" href="" data-icon="d"><span></span></a>
			<a href="" class="options" data-icon="o"></a>
		</div>
	</div>

	<div id="board" ng-style="{
		width : grids.width,
		height : grids.height,
		left : grids.defaults.sideWidth,
		top : grids.defaults.topHeight
	}" ng-dblclick="onBoardClick($event)">
			<ul id="gridLines" ng-class="grids.show ? 'showGrid' : 'hideGrid'">
				<li class="hline gline" ng-repeat="item in grids.rows" ng-style="{
					top : $index * grids.gridFullHeight,
					height : grids.gridHeight
				}"></li>
				<li class="vline gline" ng-repeat="item in grids.cols" ng-style="{
					left : $index * grids.gridFullWidth, 
					width : grids.gridWidth,
					height : grids.height
				}"></li>
			</ul>

			<!-- <div id="how-many-links">
				<p><span>30</span> links</p>
			</div> -->
			
			<div lk-folder data="folder" lk-drag drag-preview="dragPreview.folder" ng-repeat="folder in folders"></div>
			<div lk-link data="link" lk-drag drag-preview="dragPreview.link" ng-repeat="link in links"  ng-click="onLinkClick($event)"></div>

			<div id="folder-drop-preview" ng-style="{
				width : grids.gridWidth,
				height : grids.folderSize.height,
				left : dragPreview.folder.grid[0] * grids.gridFullWidth,
				top : dragPreview.folder.grid[1] * grids.gridFullHeight,
				display : dragPreview.folder.show ? 'block' : 'none'
			}"></div>

			<div id="link-drop-preview" ng-style="{
				left : dragPreview.link.grid[0] * grids.gridFullWidth,
				top : dragPreview.link.grid[1] * grids.gridFullHeight,
				width : grids.linkSize.width,
				height : grids.gridHeight,
				display : dragPreview.link.show ? 'block' : 'none'
			}"></div>
					
	</div>

	<div id="bg-dot"></div>
</div>

