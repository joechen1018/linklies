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

<div id="bg-loading">
	<div class="bar"></div>
</div>
<div id="desktop-view" ng-controller="desktopCtrl" ng-style="getDesktopStyle()">

	<div context-menu context-menu-data="context"></div>

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

	<div id="drag-containment"></div>

	<div id="board" ng-style="{
		width : grids.width,
		height : grids.height,
		left : grids.defaults.sideWidth,
		top : grids.defaults.topHeight
	}" ng-dblclick="onBoardDbClick($event)" ng-click="onBoardClick($event)" ng-right-click="onRightClick($event)">

			<!-- <ul id="gridLines" ng-class="grids.show ? 'showGrid' : 'hideGrid'">
				<li class="hline gline" ng-repeat="item in grids.rows" ng-style="{
					top : $index * grids.gridFullHeight,
					height : grids.gridHeight
				}"></li>
				<li class="vline gline" ng-repeat="item in grids.cols" ng-style="{
					left : $index * grids.gridFullWidth, 
					width : grids.gridWidth,
					height : grids.height
				}"></li>
			</ul> -->
			
			<div lk-folder data="folder" ng-right-click="onRightClick($event)" bindonce lk-drag drag-preview="dragPreview.folder" ng-repeat="folder in folders" ></div>
			<div lk-link data="link" ng-right-click="onRightClick($event)" bindonce ng-dblclick="onLinkDbClick($event)" lk-drag drag-preview="dragPreview.link" ng-repeat="link in links" ng-click="onLinkClick($event)"></div>

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
	<!-- end #baord -->

	<div id="browser" ng-show="showBrowser">
		<div class="iframe-wrap" ng-show="showBrowser && showWrap">
			<iframe src="" frameborder="0" ng-style="{
				display : none
			}"></iframe>
		</div>
		<div class="bg"></div>

		<div class="btns">
			<div class="btn">
				<span data-icon="q" ng-click="closeBrowser()"></span>	
			</div>
			<!-- <div class="btn">
				<span data-icon="q" ng-click="closeBrowser()"></span>	
			</div> -->
		</div>
	</div>
	<!-- end #browser -->
</div>

