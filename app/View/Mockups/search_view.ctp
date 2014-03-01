<?php 

?>

<ul class="search" >
	<li ng-repeat="rs in results">
		<a href="{{rs.href}}" target="_blank">{{rs.title}}</a>
		<span class="date">{{rs.date}}</span>
	</li>
</ul>