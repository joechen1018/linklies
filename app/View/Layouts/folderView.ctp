<!DOCTYPE HTML>
<html lang="en-US" ng-app="lk" ng-controller="folderViewCtrl">
<head>
	<meta charset="UTF-8">
	<title><?php echo $data["Folder"]["name"] ?></title>
	<link rel="icon" href="<?php echo $this -> webroot ?>logo.ico" type="image/x-icon"/>
	
	<!-- <link href='http://fonts.googleapis.com/css?family=Ubuntu Condensed' rel='stylesheet' type='text/css'> -->
	<link href='http://fonts.googleapis.com/css?family=Droid Sans,Molengo,Muli' rel='stylesheet' type='text/css'>

	<script>
	  var _con = console;
	  console = { log : function(){} }
	</script>
	<link rel="stylesheet/less" type="text/css" href="<?php echo $this -> webroot?>css/folder-view.less" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.6.2/less.min.js" type="text/javascript"></script>
	<?php 
		$this -> Js -> set("data", $data); 
		echo $this -> Js -> writeBuffer(array(
			"onDomReady" => false
		));
	?>
	<script>
		var appData = app.data;
		console = _con;
		var _c = _con;
		var root = '<?php echo $this -> webroot?>';
	</script>

	<!-- jquery -->
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	
	<!-- angularjs -->
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js"></script>

	<!-- angular-route -->
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-route.js"></script>

	<!-- underscore -->
	<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>

	<!-- jquery ui -->
	<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script> 
	
	<!-- folder view main -->
	<script src="<?php echo $this -> webroot?>js/folders.js" type="text/javascript" charset="utf-8"></script>

	<!-- iframe-browser.js -->
	<script src="<?php echo $this -> webroot?>js/directives/iframe-browser.js" type="text/javascript" charset="utf-8"></script>
	
	<!-- google api -->
	<script src="<?php echo $this -> webroot?>js/services/gapi.js" type="text/javascript" charset="utf-8"></script>
	
	<!-- 3rd party plugins -->
	<script src="<?php echo $this -> webroot?>js/plugins.js" type="text/javascript" charset="utf-8"></script>
	
	<!-- keybaordManager service -->
	<script src="<?php echo $this -> webroot?>js/services/keyboardManager.js" type="text/javascript" charset="utf-8"></script>
	
	<!-- controller -->
	<script src="<?php echo $this -> webroot?>js/controllers/folderCtrl.js" type="text/javascript" charset="utf-8"></script>

	<!-- backend api for folder view -->
	<script src="<?php echo $this -> webroot?>js/services/folderViewApi.js" type="text/javascript" charset="utf-8"></script>

</head>
<body style="overflow: hidden;">
	<?php echo $this -> fetch("content") ?>
</body>
</html>