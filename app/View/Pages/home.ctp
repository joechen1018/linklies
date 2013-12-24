<?php $h = $this -> Html; ?>
<!-- <div id="topBar">
		<a class="save" href="javascript:saveBoard()">Save</a>
		<a class="clear" href="javascript:clearBoard()">Clear</a>
</div> -->
<div id="desktop-view">
	<div class="link">
		<div id="top">
			<div class="icon">
				<img src="" />
			</div>
			<div class="input">
				<input class="url" />
			</div>
			<a class="link-title" target="_blank"></a>
			<div class="funcs"></div>
		</div>
	</div>
	<script type="text/javascript" charset="utf-8">
		var linkyTmp = $(".link").remove().clone();
		var root = "<?php echo $this -> webroot?>";
	</script>
</div>
