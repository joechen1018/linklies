<!DOCTYPE HTML>
<html lang="en-US" ng-app="mk">
<head>
	<meta charset="UTF-8">
	<title>Linkies</title>
	<link rel="icon" href="logo.ico" type="image/x-icon"/>
	
	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular-route.js"></script>
	<script src="<?php echo $this -> webroot?>js/mockups.js"></script>
	<script src="<?php echo $this -> webroot?>js/plugins.js"></script>
	<script src="<?php echo $this -> webroot?>js/services/apiService.js"></script>
	
	<!-- <link href='http://fonts.googleapis.com/css?family=Ubuntu Condensed' rel='stylesheet' type='text/css'> -->
	<link href='http://fonts.googleapis.com/css?family=Droid Sans' rel='stylesheet' type='text/css'>

	<script>
	  less = {
	    // env: "development",
	    // async: false,
	    // fileAsync: false,
	    // poll: 1000,
	    // functions: {},
	    // dumpLineNumbers: "comments",
	    // relativeUrls: false,
	    // rootpath: ":/a.com/"
	  };
	  var _con = console;
	  console = { log : function(){} }
	</script>
	<link rel="stylesheet/less" type="text/css" href="<?php echo $this -> webroot?>css/mockups.less?view=<?php echo "desktop-view"?>" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.6.2/less.min.js" type="text/javascript"></script>
	<script>
		console = _con;
		var _c = _con;
		var root = '<?php echo $this -> webroot?>';
	</script>
	
</head>
<body>
	<div id="mockup-wrap" ng-controller="mockupsCtrl">
		<?php echo $this -> fetch("content") ?>	
	</div>
</body>
</html>