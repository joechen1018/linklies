<?php $h = $this -> Html; ?>
<!-- <div id="topBar">
		<a class="save" href="javascript:saveBoard()">Save</a>
		<a class="clear" href="javascript:clearBoard()">Clear</a>
</div> -->

<div id="desktop-view" ng-controller="desktopCtrl">
	
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
	<ul id="grid">
		<li class="hline gline" ng-repeat="line in grid.hlines" ng-style="{
			top : 20 + $index * (grid.gridHeight + grid.gridMargin) - gridMargin
		}"></li>
		<li class="vline gline" ng-repeat="line in grid.vlines" ng-style="{
			left : 20 + $index * (grid.gridWidth + grid.gridMargin), 
			width : grid.gridWidth,
			height : grid.viewHeight
		}"></li>
	</ul>

	<div class="folder {{folder.type}}" ng-repeat="folder in folders" folder-directive id="{{folder.id}}" ng-style="{
		left : 20 + folder.grid[0] * (grid.gridWidth + 10),
		top : 20 + folder.grid[1] * (grid.gridHeight * 4 + grid.gridMargin*3),
		width : grid.gridWidth,
		height : grid.folderHeight
	}">
		<p class="name">{{folder.name}}</p>
	</div>

	<div id="folder-drop-preview"></div>
	<div id="link-drop-preview"></div>
	
	<div id="msg-box">
		<div class="arrow-up"></div>
		<p class="msg-body">Hello Linklies!</p>
	</div>
	
	<div ng-repeat="link in links" link-directive id="{{link.id}}" class="link" ng-style="{
		left : 20 + link.grid[0] * grid.gridWidth,
		top : link.grid[1] * (grid.gridHeight + grid.gridMargin) + 20,
		height : grid.gridHeight,
		width : grid.linkWidth
	}">
		<div class="state-paste-url">
			<input />
		</div>
		<div class="state-ready">
			<div class="link-body">
				<div class="icon" style="background:url(http://www.youtube.com/favicon.ico) center center no-repeat">
					<!-- <img src="http://www.youtube.com/favicon.ico" /> -->
				</div>
				<a class="title" target="_blank">{{link.pageTitle}}</a>
			</div>
			<div class="link-details hide">
				<div class="arrow arrow-up"></div>
				<div class="arrow arrow-down"></div>

				<div class="page page-1">
					<img class="thumb" src="{{link.thumb}}">
					<div class="texts">
						<h1>
							{{link.contentTitle}}
							<p><a class="from external" href="www.youtube.com" target="_blank">{{link.from}}</a></p>
						</h1>
						<p class="desc">{{link.desc}}</p>	
						<div class="more">
							<div class="arrow-right"></div>
							<a href="">Next</a>	
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>

	<div id="bg-dot"></div>
	<script type="text/javascript" charset="utf-8">
		// var linkyTmp = $(".link").remove().clone();
		// var root = "<?php echo $this -> webroot?>";
		// $("body").append(linkyTmp);
	</script>
</div>
