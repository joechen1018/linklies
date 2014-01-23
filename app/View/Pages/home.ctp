<?php $h = $this -> Html; ?>
<!-- <div id="topBar">
		<a class="save" href="javascript:saveBoard()">Save</a>
		<a class="clear" href="javascript:clearBoard()">Clear</a>
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

			<ul id="grid" ng-class="gridClass()">
				<li class="hline gline" ng-repeat="line in grid.hlines" ng-style="{
					top : line.top
				}"></li>
				<li class="vline gline" ng-repeat="line in grid.vlines" ng-style="{
					left : line.index * (grid.gridWidth + grid.gridMargin), 
					width : grid.gridWidth,
					height : grid.boardHeight
				}"></li>
			</ul>
			
			<div lk-folder data="folder" ng-repeat="folder in folders"></div>

			<div id="folder-drop-preview" ng-style="{
				width : grid.gridWidth,
				height : grid.folderHeight,
				left : folderPreviewGrid[0] * (grid.gridWidth + grid.gridMargin),
				top : folderPreviewGrid[1] * (grid.gridHeight+ grid.gridMargin) * 4,
				display : showFolderPreview ? 'block' : 'none'
			}"></div>

			<div id="link-drop-preview" ng-style="{
				left : linkPreviewGrid[0] * (grid.gridWidth + grid.gridMargin),
				top : linkPreviewGrid[1] * (grid.gridHeight + grid.gridMargin),
				width : grid.linkWidth,
				height : grid.gridHeight,
				display : showLinkPreview ? 'block' : 'none'
			}"></div>
			
			<div lk-link ng-repeat="link in links" id="{{link.id}}" class="link" data-grid="{{link.grid}}" ng-style="getLinkStyle(link)"></div>			
	</div>

	<div id="bg-dot"></div>
</div>

