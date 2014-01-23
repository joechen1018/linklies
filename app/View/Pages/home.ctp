<?php $h = $this -> Html; ?>
<!-- <div id="topBar">
		<a class="save" href="javascript:saveBoard()">Save</a>
		<a class="clear" href="javascript:clearBoard()">Clear</a>
</div> -->

<!-- <div id="dev-view" ng-controller="devCtrl">
	<h1>{{obj.a}} + {{obj.b}} = {{result}}</h1>
	<a href="#" ng-click="onclick">click</a>
</div> -->

<div id="desktop-view" ng-controller="desktopCtrl" ng-style="getDesktopStyle()">
		
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
		<!-- <p><span data-icon="g" class="icon"></span><span class="logo">LiNKlies</span></p> -->
		<div class="search">
			<input type="text" placeholder="enter keywords">
			<span data-icon="n"></span>
		</div>
		<div class="home">
			<span data-icon="r"></span>
		</div>
		<div class="funcs-1">
			<a class="addNew" href="" data-icon="d"><span></span></a>
			<a href="" class="options" data-icon="o"></a>
		</div>
	</div>

	<div id="board" ng-style="{
		width : grid.boardWidth,
		height : grid.boardHeight,
		left : grid.sideWidth,
		top : grid.topHeight
	}">
			<ul id="grid" ng-show="showGrid">
				<!-- <li class="hline gline" ng-repeat="line in grid.hlines" ng-style="{
					top : $index * (grid.gridHeight + grid.gridMargin)
				}"></li>
				<li class="vline gline" ng-repeat="line in grid.vlines" ng-style="{
					left : line.index * (grid.gridWidth + grid.gridMargin), 
					width : grid.gridWidth,
					height : grid.boardHeight
				}"></li> -->
			</ul>
			
			<div lk-folder data="folder" drag-preview="dragPreview.folder" ng-repeat="folder in folders"></div>
			<div lk-link data="link"  drag-preview="dragPreview.link" ng-repeat="link in links"></div>	

			<div id="folder-drop-preview" ng-style="{
				width : grid.gridWidth,
				height : grid.folderHeight,
				left : dragPreview.folder.grid[0] * (grid.gridWidth + grid.gridMargin),
				top : dragPreview.folder.grid[1] * (grid.gridHeight+ grid.gridMargin) * 4,
				display : dragPreview.folder.show ? 'block' : 'none'
			}"></div>

			<div id="link-drop-preview" ng-style="{
				left : dragPreview.link.grid[0] * (grid.gridWidth + grid.gridMargin),
				top : dragPreview.link.grid[1] * (grid.gridHeight + grid.gridMargin),
				width : grid.linkWidth,
				height : grid.gridHeight,
				display : dragPreview.link.show ? 'block' : 'none'
			}"></div>
					
	</div>

	<div id="bg-dot"></div>
</div>

