<!DOCTYPE HTML>
<html lang="en-US" ng-app="lk">
<head>
	<meta charset="UTF-8">
	<title>Linkies</title>
	<link href='http://fonts.googleapis.com/css?family=Tauri' rel='stylesheet' type='text/css'>
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
	
	<link rel="stylesheet" href="<?php echo $this -> webroot?>css/reset.css" type="text/css" media="screen"  charset="utf-8"/>
	<link rel="stylesheet/less" type="text/css" href="<?php echo $this -> webroot?>css/main.less" />
	
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js"></script>
	<script src="<?php echo $this -> webroot?>js/main.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/less.js" type="text/javascript"></script>
	
</head>
<body>
	<?php echo $this -> fetch("content") ?>
</body>
</html>