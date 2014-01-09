<!DOCTYPE HTML>
<html lang="en-US" ng-app="lk">
<head>
	<meta charset="UTF-8">
	<title>Linkies</title>
	<link rel="icon" href="logo.ico" type="image/x-icon"/>
	
	<link href='http://fonts.googleapis.com/css?family=Tauri' rel='stylesheet' type='text/css'>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
	
	<link rel="stylesheet" href="<?php echo $this -> webroot?>css/reset.css" type="text/css" media="screen"  charset="utf-8"/>
	<link rel="stylesheet/less" type="text/css" href="<?php echo $this -> webroot?>css/main.less" />

	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js"></script>
	
	<script src="<?php echo $this -> webroot?>js/plugins.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/main.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/desktopCtrl.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/snapGridCtrl.js" type="text/javascript" charset="utf-8"></script>
	

	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.5.0/less.min.js" type="text/javascript"></script>
</head>
<body>
	<?php echo $this -> fetch("content") ?>
</body>
</html>