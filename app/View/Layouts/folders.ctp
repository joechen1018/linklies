<!DOCTYPE HTML>
<html lang="en-US" ng-app="lk" ng-controller="folderViewCtrl">
<head>
	<meta charset="UTF-8">
	<title>Linklies</title>
	<link rel="icon" href="logo.ico" type="image/x-icon"/>
	
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-route.js"></script>
	
	<!-- <link href='http://fonts.googleapis.com/css?family=Ubuntu Condensed' rel='stylesheet' type='text/css'> -->
	<link href='http://fonts.googleapis.com/css?family=Droid Sans' rel='stylesheet' type='text/css'>

	<script>
	  var _con = console;
	  console = { log : function(){} }
	</script>
	<link rel="stylesheet/less" type="text/css" href="<?php echo $this -> webroot?>css/folder-view.less" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.6.2/less.min.js" type="text/javascript"></script>
	<script>
		console = _con;
		var _c = _con;
		var root = '<?php echo $this -> webroot?>';
	</script>
	
	<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>
	<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script> 
	<script src="<?php echo $this -> webroot?>js/folders.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/plugins.js" type="text/javascript" charset="utf-8"></script>

	<script src="<?php echo $this -> webroot?>js/controllers/folderCtrl.js" type="text/javascript" charset="utf-8"></script>
	<script src="<?php echo $this -> webroot?>js/services/apiService.js" type="text/javascript" charset="utf-8"></script>

</head>
<body style="overflow: hidden;">
	<?php echo $this -> fetch("content") ?>
</body>
</html>